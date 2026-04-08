'use client'

import { useState, useEffect } from 'react'

export default function VoiceAssistantLayout({ children }) {
  // This layout disables background voice assistant
  return (
    <>
      {/* Disable background voice assistant by passing enabled=false */}
      {children}
    </>
  )
}
