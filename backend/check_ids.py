from app import create_app
from models.database_models import Student

app = create_app()
with app.app_context():
    students = Student.query.all()[:5]
    for s in students:
        print(f'ID: {s.id} ({type(s.id).__name__}) - Name: {s.name}')
