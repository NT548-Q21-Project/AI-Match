from uuid import uuid4

from app.models import Job


def test_list_public_jobs_returns_active_jobs_only(client, db_session):
    active_job = Job(
        recruiter_id=uuid4(),
        title="Backend Engineer",
        description="Build APIs",
        job_type="full_time",
        status="active",
        location="Remote",
    )
    draft_job = Job(
        recruiter_id=uuid4(),
        title="Draft Role",
        description="Draft",
        job_type="full_time",
        status="draft",
        location="Remote",
    )

    db_session.add_all([active_job, draft_job])
    db_session.commit()

    response = client.get("/recruitment/jobs")

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "Backend Engineer"
