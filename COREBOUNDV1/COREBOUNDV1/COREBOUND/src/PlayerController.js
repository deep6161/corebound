/**
 * ============================================================================
 * COREBOUND — PLAYER CONTROLLER & ANIMATION STATE MACHINE
 * ============================================================================
 * Production-ready third-person kinematic character controller supporting
 * acceleration, deceleration, sprint, jump, collision detection, and a 10-state
 * animation state machine with procedural Web Audio feedback.
 */

import * as THREE from 'three';

export class PlayerController {
    constructor(character, options = {}) {
        this.character = character;
        this.options = Object.assign({
            walkSpeed: 7.2,
            runSpeed: 10.5,
            sprintSpeed: 14.2,
            acceleration: 32.0,
            deceleration: 26.0,
            gravity: 28.0,
            jumpImpulse: 10.8,
            rotationSpeed: 14.0,
            groundY: 0.0
        }, options);

        // Position & Kinematics
        this.position = this.character.group.position;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.currentSpeed = 0;
        this.rotationY = Math.PI; // Face towards negative Z initially
        this.isGrounded = true;
        this.isLocked = false; // Locked during modal/interaction

        // Key states
        this.keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            sprint: false,
            jump: false,
            interact: false
        };

        // Touch Virtual Joystick input
        this.joystickDelta = { x: 0, y: 0 };

        // 10-State Animation State Machine
        // 'IDLE' | 'WALK' | 'RUN' | 'SPRINT' | 'JUMP' | 'FALL' | 'LAND' | 'INTERACT' | 'INSPECT' | 'VICTORY'
        this.currentState = 'IDLE';
        this.stateTimer = 0;

        // Custom Ground Height Resolver (can be overridden by level/environment)
        this.groundHeightResolver = (x, z) => this.options.groundY;

        // Audio synthesizer
        this.initAudio();
        this.bindEvents();
    }

    // =========================================================================
    // 1. PROCEDURAL WEB AUDIO SYNTHESIS
    // =========================================================================
    initAudio() {
        this.audioCtx = null;
        this.stepTimer = 0;
    }

    ensureAudio() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) this.audioCtx = new AudioContext();
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playFootstep() {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(130 + Math.random() * 30, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(35, this.audioCtx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.07);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.07);
    }

    playJumpSound() {
        if (!this.audioCtx) return;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(450, this.audioCtx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.16);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start();
        osc.stop(this.audioCtx.currentTime + 0.16);
    }

    // =========================================================================
    // 2. INPUT LISTENERS
    // =========================================================================
    bindEvents() {
        window.addEventListener('keydown', (e) => {
            this.ensureAudio();
            if (this.isLocked) return;
            switch (e.code) {
                case 'KeyW':
                case 'ArrowUp':
                    this.keys.forward = true;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    this.keys.backward = true;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    this.keys.left = true;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    this.keys.right = true;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.keys.sprint = true;
                    break;
                case 'Space':
                    if (this.isGrounded && !this.keys.jump) {
                        this.triggerJump();
                    }
                    this.keys.jump = true;
                    e.preventDefault();
                    break;
                case 'KeyE':
                    this.keys.interact = true;
                    break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch (e.code) {
                case 'KeyW':
                case 'ArrowUp':
                    this.keys.forward = false;
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    this.keys.backward = false;
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.keys.sprint = false;
                    break;
                case 'Space':
                    this.keys.jump = false;
                    break;
                case 'KeyE':
                    this.keys.interact = false;
                    break;
            }
        });
    }

    // =========================================================================
    // 3. ACTION TRIGGERS & STATE TRANSITIONS
    // =========================================================================
    triggerJump() {
        if (!this.isGrounded || this.isLocked) return;
        this.velocity.y = this.options.jumpImpulse;
        this.isGrounded = false;
        this.currentState = 'JUMP';
        this.playJumpSound();
    }

    triggerInteract(duration = 1.6, onComplete) {
        this.currentState = 'INTERACT';
        this.stateTimer = duration;
        this.isLocked = true;
        this.velocity.set(0, 0, 0);

        setTimeout(() => {
            this.isLocked = false;
            this.currentState = 'IDLE';
            if (onComplete) onComplete();
        }, duration * 1000);
    }

    triggerInspect(duration = 2.4, onComplete) {
        this.currentState = 'INSPECT';
        this.stateTimer = duration;
        this.isLocked = true;
        this.velocity.set(0, 0, 0);

        setTimeout(() => {
            this.isLocked = false;
            this.currentState = 'IDLE';
            if (onComplete) onComplete();
        }, duration * 1000);
    }

    triggerVictory(duration = 3.0, onComplete) {
        this.currentState = 'VICTORY';
        this.stateTimer = duration;
        this.isLocked = true;
        this.velocity.set(0, 0, 0);

        setTimeout(() => {
            this.isLocked = false;
            this.currentState = 'IDLE';
            if (onComplete) onComplete();
        }, duration * 1000);
    }

    // =========================================================================
    // 4. CORE KINEMATICS & PHYSICS UPDATE
    // =========================================================================
    update(delta, time, cameraYaw = 0) {
        if (!delta || delta > 0.1) delta = 0.016;

        // 1. Calculate Camera-Relative Movement Direction Vector
        let moveX = 0;
        let moveZ = 0;

        const sinYaw = Math.sin(cameraYaw);
        const cosYaw = Math.cos(cameraYaw);

        if (!this.isLocked) {
            if (this.keys.forward) {
                moveX -= sinYaw;
                moveZ -= cosYaw;
            }
            if (this.keys.backward) {
                moveX += sinYaw;
                moveZ += cosYaw;
            }
            if (this.keys.right) {
                moveX += cosYaw;
                moveZ -= sinYaw;
            }
            if (this.keys.left) {
                moveX -= cosYaw;
                moveZ += sinYaw;
            }

            // Virtual Joystick Input
            if (Math.abs(this.joystickDelta.x) > 0.1 || Math.abs(this.joystickDelta.y) > 0.1) {
                const joyX = this.joystickDelta.x;
                const joyY = this.joystickDelta.y;
                moveX += cosYaw * joyX - sinYaw * joyY;
                moveZ += -sinYaw * joyX - cosYaw * joyY;
            }
        }

        const inputLen = Math.hypot(moveX, moveZ);
        const hasInput = inputLen > 0.05 && !this.isLocked;

        // 2. Determine Target Speed (Walk / Run / Sprint)
        let targetSpeed = 0;
        if (hasInput) {
            if (this.keys.sprint) {
                targetSpeed = this.options.sprintSpeed;
            } else {
                targetSpeed = this.options.walkSpeed;
            }
        }

        // 3. Smooth Acceleration & Deceleration (No sliding)
        if (targetSpeed > this.currentSpeed) {
            this.currentSpeed = Math.min(targetSpeed, this.currentSpeed + this.options.acceleration * delta);
        } else {
            this.currentSpeed = Math.max(targetSpeed, this.currentSpeed - this.options.deceleration * delta);
        }

        // 4. Update Horizontal Position & Collision Boundary
        if (this.currentSpeed > 0.01 && hasInput) {
            const normX = moveX / inputLen;
            const normZ = moveZ / inputLen;

            const dx = normX * this.currentSpeed * delta;
            const dz = normZ * this.currentSpeed * delta;

            const nextX = this.position.x + dx;
            const nextZ = this.position.z + dz;

            // Basic Circular Boundary check (Default radius 45m, can be overridden)
            const r = Math.hypot(nextX, nextZ);
            if (r <= 48.0) {
                this.position.x = nextX;
                this.position.z = nextZ;
            }

            // 5. Smooth Character Slerp Rotation toward movement heading
            const targetRotation = Math.atan2(normX, normZ);
            let rotDiff = targetRotation - this.rotationY;
            while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
            while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
            this.rotationY += rotDiff * Math.min(1.0, delta * this.options.rotationSpeed);
            this.character.group.rotation.y = this.rotationY;
        }

        // 6. Vertical Kinematics: Gravity, Jump & Ground Collision
        const currentGroundY = this.groundHeightResolver(this.position.x, this.position.z);

        if (!this.isGrounded) {
            this.velocity.y -= this.options.gravity * delta;
            this.position.y += this.velocity.y * delta;

            // Falling state
            if (this.velocity.y < -1.0) {
                this.currentState = 'FALL';
            }

            // Floor collision check (Never fall through ground)
            if (this.position.y <= currentGroundY) {
                this.position.y = currentGroundY;
                this.velocity.y = 0;
                this.isGrounded = true;
                this.currentState = 'LAND';
                this.stateTimer = 0.12; // Short landing compression
                this.playFootstep();
            }
        } else {
            // Smoothly conform to terrain/platform elevation
            this.position.y = THREE.MathUtils.lerp(this.position.y, currentGroundY, delta * 12.0);

            // Handle Landing recovery
            if (this.currentState === 'LAND') {
                this.stateTimer -= delta;
                if (this.stateTimer <= 0) {
                    this.currentState = hasInput ? (this.keys.sprint ? 'SPRINT' : 'WALK') : 'IDLE';
                }
            } else if (!this.isLocked) {
                // Update Locomotion Animation States
                if (this.currentSpeed > 0.2) {
                    if (this.keys.sprint && this.currentSpeed > 11.0) {
                        this.currentState = 'SPRINT';
                    } else if (this.currentSpeed > 8.0) {
                        this.currentState = 'RUN';
                    } else {
                        this.currentState = 'WALK';
                    }

                    // Procedural Footstep Timing
                    const stepInterval = this.currentState === 'SPRINT' ? 0.26 : (this.currentState === 'RUN' ? 0.32 : 0.42);
                    this.stepTimer += delta;
                    if (this.stepTimer >= stepInterval) {
                        this.stepTimer = 0;
                        this.playFootstep();
                    }
                } else {
                    this.currentState = 'IDLE';
                    this.stepTimer = 0;
                }
            }
        }

        // 7. Update Character Mesh Hierarchy and Procedural Kinematics
        this.character.update(delta, time, this.currentState, {
            isGrounded: this.isGrounded,
            speed: this.currentSpeed,
            velocityY: this.velocity.y
        });
    }
}
