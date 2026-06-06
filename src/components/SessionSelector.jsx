import { SESSIONS } from '../utils/constants';

export default function SessionSelector({ activeSession, onSelect }) {
  return (
    <div className="session-tabs">
      {SESSIONS.map((session) => (
        <button
          key={session.id}
          className={`session-tab ${activeSession === session.id ? 'active' : ''}`}
          onClick={() => onSelect(session.id)}
          title={session.label}
        >
          {session.short}
          <span className="text-sm" style={{ marginLeft: 4, opacity: 0.7 }}>
            {session.label.split('—')[1]?.trim()}
          </span>
        </button>
      ))}
    </div>
  );
}
