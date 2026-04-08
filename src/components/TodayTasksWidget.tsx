'use client';

import React from 'react';

export function TodayTasksWidget() {
  console.log('[WIDGET] TodayTasksWidget rendering - MINIMAL TEST VERSION');
  
  return (
    <div
      style={{
        backgroundColor: '#ef4444',
        border: '4px solid #7f1d1d',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '16px',
        }}
      >
        🔴 RED TEST BOX - WIDGET IS RENDERING!
      </div>
      <div style={{ color: 'white', fontSize: '14px', lineHeight: '1.5' }}>
        <p>If you see this bright red box on the homepage, the Today's Tasks Widget is successfully rendering.</p>
        <p style={{ marginTop: '12px' }}>
          The full feature with task management is coming next. Check the browser console for debug logs.
        </p>
      </div>
    </div>
  );
}
