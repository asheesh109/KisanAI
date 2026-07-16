export const telemetry = {
  track: (eventName: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Telemetry] ${eventName}`, properties);
    }
    // TODO: Integrate actual analytics provider (Plausible/PostHog) as per ROADMAP
  }
};
