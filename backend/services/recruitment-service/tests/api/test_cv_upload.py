from io import BytesIO
from uuid import uuid4

from app.models import CV


class FakeDoc:
    metadata = {"title": "Parsed CV Title"}
    page_count = 3

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return False


def test_upload_cv_should_upload_to_cloudinary_and_store_metadata(
    monkeypatch, client, db_session
):
    monkeypatch.setattr("app.service.fitz.open", lambda *args, **kwargs: FakeDoc())
    monkeypatch.setattr(
        "app.service.cloudinary.uploader.upload",
        lambda *args, **kwargs: {
            "secure_url": "https://res.cloudinary.com/demo/raw/upload/v1/cvs/resume.pdf",
            "public_id": "cvs/resume",
        },
    )

    response = client.post(
        "/recruitment/cvs/upload",
        headers={
            "X-User-Id": str(uuid4()),
            "X-Auth-Id": str(uuid4()),
            "X-User-Email": "candidate@example.com",
            "X-User-Role": "candidate",
        },
        data={"title": "My CV"},
        files={
            "file": ("resume.pdf", BytesIO(b"%PDF-1.4 fake pdf"), "application/pdf")
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["title"] == "My CV"
    assert payload["file_url"].startswith("https://res.cloudinary.com/")

    saved_cv = db_session.query(CV).one()
    assert saved_cv.file_url == payload["file_url"]
