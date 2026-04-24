import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [goals, setGoals] = useState([]);
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");

  // Load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("goals"));
    if (saved) setGoals(saved);
  }, []);

  // Save
  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  // 🔔 Reminder
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();

      setGoals((prev) =>
        prev.map((g) => {
          if (!g.alerted && new Date(g.deadline).getTime() <= now) {
            alert(`⏰ Time's up for: ${g.text}`);
            return { ...g, alerted: true };
          }
          return g;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addGoal = () => {
    if (!text || !deadline) return;

    if (goals.length >= 3) {
      alert("Only 3 goals allowed!");
      return;
    }

    setGoals([
      ...goals,
      { text, deadline, done: false, alerted: false },
    ]);

    setText("");
    setDeadline("");
  };

  const toggleGoal = (i) => {
    const updated = [...goals];
    updated[i].done = !updated[i].done;
    setGoals(updated);
  };

  const resetAll = () => {
    if (window.confirm("Reset all goals?")) {
      setGoals([]);
    }
  };

  const clearCompleted = () => {
    setGoals(goals.filter((g) => !g.done));
  };

  const completed = goals.filter((g) => g.done).length;

  return (
    <div className="app">
      {/* LEFT */}
      <div className="left">
        <h1>🎯 Mini Goals</h1>

        <div className="card">
          <h3>Add Goal</h3>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What do you want to do?"
          />

          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button onClick={addGoal}>+ Add Goal</button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right">
        <h2>Your Goals</h2>

        {goals.length === 0 ? (
          <div className="empty">
            <p>🚀 No goals yet</p>
            <span>Add one from the left →</span>
          </div>
        ) : (
          <>
            <ul>
              {goals.map((g, i) => {
                const isOverdue =
                  new Date(g.deadline).getTime() < new Date().getTime() &&
                  !g.done;

                return (
                  <li
                    key={i}
                    onClick={() => toggleGoal(i)}
                    className={isOverdue ? "overdue" : ""}
                  >
                    <div>
                      <span className={g.done ? "done" : ""}>
                        {g.text}
                      </span>
                      <p className="time">
                        ⏰ {new Date(g.deadline).toLocaleString()}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Bottom Bar */}
            <div className="bottom-bar">
              <p>
                ✅ {completed} / {goals.length} completed
              </p>

              <div className="actions">
                <button onClick={clearCompleted}>
                  Clear Completed
                </button>
                <button className="danger" onClick={resetAll}>
                  Reset All
                </button>
              </div>
            </div>

            {/* Perfect Day */}
            {goals.length > 0 && completed === goals.length && (
              <h3 className="perfect">🔥 Perfect Day!</h3>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;