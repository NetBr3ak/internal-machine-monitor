from flask import Flask, render_template, request, redirect, url_for, jsonify
import sqlite3
import datetime

app = Flask(__name__)

# Funkcje pomocnicze dla bazy danych


def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute('''CREATE TABLE IF NOT EXISTS machines (
                        id INTEGER PRIMARY KEY,
                        name TEXT NOT NULL,
                        status TEXT NOT NULL,
                        current_task TEXT,
                        time_left INTEGER
                    )''')
    conn.execute('''CREATE TABLE IF NOT EXISTS tasks (
                        id INTEGER PRIMARY KEY,
                        name TEXT NOT NULL,
                        machine_id INTEGER,
                        duration INTEGER,
                        status TEXT NOT NULL,
                        FOREIGN KEY (machine_id) REFERENCES machines (id)
                    )''')
    conn.execute('''CREATE TABLE IF NOT EXISTS failures (
                        id INTEGER PRIMARY KEY,
                        machine_id INTEGER,
                        description TEXT,
                        type TEXT,
                        image TEXT,
                        reported_at DATETIME,
                        status TEXT NOT NULL,
                        priority TEXT,
                        started_at DATETIME,
                        fixed_at DATETIME,
                        FOREIGN KEY (machine_id) REFERENCES machines (id)
                    )''')
    # Dodaj przykładowe dane jeśli puste
    if not conn.execute('SELECT * FROM machines').fetchone():
        conn.execute(
            "INSERT INTO machines (name, status, current_task, time_left) VALUES ('Maszyna 1', 'running', 'Zlecenie A', 30)")
        conn.execute(
            "INSERT INTO machines (name, status, current_task, time_left) VALUES ('Maszyna 2', 'setup', 'Zlecenie B', 15)")
        conn.execute(
            "INSERT INTO machines (name, status, current_task, time_left) VALUES ('Maszyna 3', 'failure', NULL, 0)")
        conn.execute(
            "INSERT INTO tasks (name, machine_id, duration, status) VALUES ('Zlecenie A', 1, 60, 'in_progress')")
        conn.execute(
            "INSERT INTO tasks (name, machine_id, duration, status) VALUES ('Zlecenie B', 2, 45, 'pending')")
        conn.execute("INSERT INTO failures (machine_id, description, type, reported_at, status, priority) VALUES (3, 'Awaria silnika', 'mechaniczna', datetime.datetime.now(), 'new', 'high')")
    conn.commit()
    conn.close()


init_db()


@app.route('/')
def index():
    return redirect(url_for('operator_dashboard'))


@app.route('/operator')
def operator_dashboard():
    conn = get_db_connection()
    machines = conn.execute('SELECT * FROM machines').fetchall()
    tasks = conn.execute(
        'SELECT * FROM tasks WHERE status != "completed"').fetchall()
    failures = conn.execute(
        'SELECT * FROM failures ORDER BY reported_at DESC LIMIT 10').fetchall()
    conn.close()
    return render_template('operator.html', machines=machines, tasks=tasks, failures=failures)


@app.route('/technician')
def technician_dashboard():
    conn = get_db_connection()
    failures = conn.execute(
        'SELECT f.*, m.name as machine_name FROM failures f JOIN machines m ON f.machine_id = m.id ORDER BY f.reported_at DESC').fetchall()
    conn.close()
    return render_template('technician.html', failures=failures)


@app.route('/report_failure', methods=['POST'])
def report_failure():
    machine_id = request.form['machine_id']
    description = request.form['description']
    failure_type = request.form['type']
    image = request.form.get('image', '')
    reported_at = datetime.datetime.now()
    status = 'new'
    priority = 'medium'  # Można dodać logikę dla priorytetu

    conn = get_db_connection()
    conn.execute('INSERT INTO failures (machine_id, description, type, image, reported_at, status, priority) VALUES (?, ?, ?, ?, ?, ?, ?)',
                 (machine_id, description, failure_type, image, reported_at, status, priority))
    conn.execute(
        'UPDATE machines SET status = "failure" WHERE id = ?', (machine_id,))
    conn.commit()
    conn.close()
    return redirect(url_for('operator_dashboard'))


@app.route('/start_repair/<int:failure_id>')
def start_repair(failure_id):
    started_at = datetime.datetime.now()
    conn = get_db_connection()
    conn.execute('UPDATE failures SET status = "in_progress", started_at = ? WHERE id = ?',
                 (started_at, failure_id))
    conn.commit()
    conn.close()
    return redirect(url_for('technician_dashboard'))


@app.route('/fix_failure/<int:failure_id>')
def fix_failure(failure_id):
    fixed_at = datetime.datetime.now()
    conn = get_db_connection()
    conn.execute(
        'UPDATE failures SET status = "fixed", fixed_at = ? WHERE id = ?', (fixed_at, failure_id))
    failure = conn.execute(
        'SELECT machine_id FROM failures WHERE id = ?', (failure_id,)).fetchone()
    conn.execute('UPDATE machines SET status = "running" WHERE id = ?',
                 (failure['machine_id'],))
    conn.commit()
    conn.close()
    return redirect(url_for('technician_dashboard'))


if __name__ == '__main__':
    app.run(debug=True)
