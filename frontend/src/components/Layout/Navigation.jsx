export default function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'report', label: 'Report', icon: '✦' },
    { id: 'logs', label: 'Logs', icon: '◉' },
    { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  ];

  return (
    <div
      style={{
        background: '#F8F2E5',
        padding: '14px 38px',
        borderBottom: '1px solid #D0C2AA',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 3px 12px rgba(70, 54, 35, 0.07)',
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Film icon */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#3C3933',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#F1E8D5',
            fontSize: '15px',
            boxShadow: '0 2px 5px rgba(70, 54, 35, 0.15)',
          }}
        >
          🎞
        </div>

        <div>
          <div
            style={{
              color: '#342F29',
              fontSize: '17px',
              fontWeight: 'bold',
              letterSpacing: '-0.3px',
              fontFamily: "'Georgia', 'Times New Roman', serif",
            }}
          >
            Greenlight Agent
          </div>

          <div
            style={{
              color: '#9A8060',
              fontSize: '8px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontFamily: 'Arial, sans-serif',
              marginTop: '2px',
            }}
          >
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: '#EDE3D0',
          padding: '5px',
          borderRadius: '24px',
          border: '1px solid #D8CBB5',
        }}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '8px 17px',
                borderRadius: '19px',
                border: isActive
                  ? '1px solid #8B6F47'
                  : '1px solid transparent',
                background: isActive
                  ? '#8B6F47'
                  : 'transparent',
                color: isActive
                  ? '#FFF8E8'
                  : '#756D62',
                cursor: 'pointer',
                fontWeight: isActive ? 'bold' : 'normal',
                fontSize: '11px',
                fontFamily: 'Arial, sans-serif',
                letterSpacing: '0.3px',
                transition: 'all 0.2s ease',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  opacity: isActive ? 1 : 0.65,
                }}
              >
                {tab.icon}
              </span>

              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          color: '#817667',
          fontSize: '9px',
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#68734B',
            display: 'inline-block',
          }}
        />

      </div>
    </div>
  );
}