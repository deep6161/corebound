from app.db.database import SessionLocal
from app.models.subject import Subject
from app.models.topic import Topic


SUBJECTS = {
    "Aptitude": [
        "Number Series",
        "Simplification",
        "Percentage",
        "Profit & Loss",
        "Ratio & Proportion",
        "Average",
        "Time & Work",
        "Time-Speed-Distance",
        "Probability",
        "Permutation & Combination",
        "Data Interpretation",
    ],
    "Logical Reasoning": [
        "Coding-Decoding",
        "Blood Relations",
        "Direction Sense",
        "Seating Arrangement",
        "Puzzles",
        "Syllogism",
        "Statement & Conclusion",
    ],
    "Programming": [
        "C",
        "Java",
        "Python",
        "C++",
        "JavaScript",
    ],
    "Data Structures & Algorithms": [
        "Arrays",
        "Strings",
        "Stack",
        "Queue",
        "Linked List",
        "Tree",
        "Graph",
        "Sorting",
        "Searching",
        "Recursion",
        "Dynamic Programming",
    ],
    "SQL": [
        "SELECT",
        "WHERE",
        "GROUP BY",
        "JOIN",
        "Subquery",
    ],
    "DBMS": [],
    "Operating System": [],
    "Computer Networks": [],
    "HR Interview": [],
    "Communication": [],
}


def seed_subjects():
    db = SessionLocal()

    try:
        for subject_name, topic_names in SUBJECTS.items():

            subject = (
                db.query(Subject)
                .filter(Subject.name == subject_name)
                .first()
            )

            if not subject:
                subject = Subject(
                    name=subject_name,
                    description=f"{subject_name} preparation for placement interviews and assessments.",
                )

                db.add(subject)
                db.flush()

                print(f"Created subject: {subject_name}")
            else:
                print(f"Subject already exists: {subject_name}")

            for topic_name in topic_names:

                existing_topic = (
                    db.query(Topic)
                    .filter(
                        Topic.subject_id == subject.id,
                        Topic.name == topic_name,
                    )
                    .first()
                )

                if not existing_topic:
                    topic = Topic(
                        subject_id=subject.id,
                        name=topic_name,
                        description=f"{topic_name} preparation topic.",
                    )

                    db.add(topic)

                    print(
                        f"  Created topic: {topic_name}"
                    )

        db.commit()

        print("\nSeed completed successfully.")


    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_subjects()