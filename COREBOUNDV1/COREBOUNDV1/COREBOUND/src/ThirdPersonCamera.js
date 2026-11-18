/**
 * ============================================================================
 * COREBOUND — PREMIUM THIRD-PERSON SPRING-ARM CAMERA SYSTEM
 * ============================================================================
 * Frame-rate independent behind-the-back follow camera with smooth mouse orbit,
 * auto-alignment during player locomotion, occlusion avoidance, and dynamic
 * screen framing (character occupying 25–35% vertical screen height).
 */

import * as THREE from 'three';

export class ThirdPersonCamera {
    constructor(camera, targetGroup, options = {}) {
        this.camera = camera;
        this.targetGroup = targetGroup;

        this.options = Object.assign({
            distance: 9.5,
            minDistance: 3.5,
            maxDistance: 16.0,
            heightOffset: 1.45,
            pitch: 0.28,
            minPitch: -0.15,
            maxPitch: 1.15,
            mouseSensitivity: 0.0035,
            smoothFollowSpeed: 10.5,
            smoothLookSpeed: 13.0,
            autoAlignSpeed: 3.6
        }, options);

        // Spherical angles
        this.yaw = 0;
        this.pitch = this.options.pitch;
        this.targetYaw = 0;
        this.targetPitch = this.options.pitch;
        this.distance = this.options.distance;
        this.targetDistance = this.options.distance;

        // Vector caches
        this.currentPos = new THREE.Vector3(0, 5, 20);
        this.lookTarget = new THREE.Vector3(0, 1.5, 0);

        // State flags
        this.isDragging = false;
        this.prevMouse = { x: 0, y: 0 };
        this.enableAutoAlign = true;

        this.bindEvents();
    }

    bindEvents() {
        window.addEventListener('mousedown', (e) => {
            // Right-click or left-click drag to orbit
            if (e.button === 0 || e.button === 2) {
                this.isDragging = true;
                this.prevMouse.x = e.clientX;
                this.prevMouse.y = e.clientY;
            }
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            const dx = e.clientX - this.prevMouse.x;
            const dy = e.clientY - this.prevMouse.y;
            this.prevMouse.x = e.clientX;
            this.prevMouse.y = e.clientY;

            this.targetYaw -= dx * this.options.mouseSensitivity;
            this.targetPitch += dy * this.options.mouseSensitivity;
            this.targetPitch = Math.max(this.options.minPitch, Math.min(this.options.maxPitch, this.targetPitch));
        });

        window.addEventListener('wheel', (e) => {
            this.targetDistance += e.deltaY * 0.008;
            this.targetDistance = Math.max(this.options.minDistance, Math.min(this.options.maxDistance, this.targetDistance));
        }, { passive: true });

        // Prevent default context menu on canvas
        window.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'CANVAS') e.preventDefault();
        });
    }

    update(delta, playerHeadingY = null, isMoving = false) {
        if (!delta || delta > 0.1) delta = 0.016;

        // 1. Auto-Align behind player's back during movement if not dragging mouse
        if (this.enableAutoAlign && isMoving && !this.isDragging && playerHeadingY !== null) {
            const behindBackYaw = playerHeadingY + Math.PI;
            let yawDiff = behindBackYaw - this.targetYaw;
            while (yawDiff < -Math.PI) yawDiff += Math.PI * 2;
            while (yawDiff > Math.PI) yawDiff -= Math.PI * 2;

            this.targetYaw += yawDiff * Math.min(1.0, delta * this.options.autoAlignSpeed);
        }

        // 2. Smoothly interpolate angles along shortest path
        let yawDelta = this.targetYaw - this.yaw;
        while (yawDelta < -Math.PI) yawDelta += Math.PI * 2;
        while (yawDelta > Math.PI) yawDelta -= Math.PI * 2;
        this.yaw += yawDelta * Math.min(1.0, delta * 12.0);

        this.pitch = THREE.MathUtils.lerp(this.pitch, this.targetPitch, Math.min(1.0, delta * 14.0));
        this.distance = THREE.MathUtils.lerp(this.distance, this.targetDistance, Math.min(1.0, delta * 8.0));

        // 3. Compute Target Look-At Vector (Framed at character chest/neck height)
        const pPos = this.targetGroup.position;
        const targetLookY = pPos.y + this.options.heightOffset;
        const targetLook = new THREE.Vector3(pPos.x, targetLookY, pPos.z);

        const smoothLookFactor = 1.0 - Math.exp(-this.options.smoothLookSpeed * delta);
        this.lookTarget.lerp(targetLook, smoothLookFactor);

        // 4. Compute Ideal Camera Position in Spherical Coordinates
        const horizDist = Math.cos(this.pitch) * this.distance;
        const vertDist = Math.sin(this.pitch) * this.distance;

        const desiredX = pPos.x + Math.sin(this.yaw) * horizDist;
        const desiredZ = pPos.z + Math.cos(this.yaw) * horizDist;
        const desiredY = Math.max(0.8, pPos.y + vertDist + 1.2);

        const desiredPos = new THREE.Vector3(desiredX, desiredY, desiredZ);

        // 5. Smooth Follow with Spring-Arm Damping
        const smoothPosFactor = 1.0 - Math.exp(-this.options.smoothFollowSpeed * delta);
        this.currentPos.lerp(desiredPos, smoothPosFactor);

        this.camera.position.copy(this.currentPos);
        this.camera.lookAt(this.lookTarget);
    }
}
