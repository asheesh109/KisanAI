import type { LucideIcon } from 'lucide-react'
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Info,
  ShieldCheck,
} from 'lucide-react'

export interface DiseaseDetailsLabels {
  about: string
  causes: string
  symptoms: string
  prevention: string
  treatment: string
  unavailable: string
}

export interface DiseaseDetailsProps {
  overview: string
  causes: string[]
  symptoms: string[]
  prevention: string[]
  treatmentRecommendations: string[]
  labels: DiseaseDetailsLabels
}

interface DetailSection {
  key: string
  title: string
  icon: LucideIcon
  description?: string
  items?: string[]
  wide?: boolean
}

interface DetailCardProps {
  section: DetailSection
  unavailableLabel: string
}

const cleanItems = (items: string[] = []): string[] =>
  items
    .map((item) => item.trim())
    .filter(Boolean)

function DetailCard({
  section,
  unavailableLabel,
}: DetailCardProps) {
  const Icon = section.icon
  const headingId = `disease-details-${section.key}-heading`
  const items = cleanItems(section.items)
  const description = section.description?.trim() ?? ''
  const hasContent = description.length > 0 || items.length > 0

  return (
    <section
      aria-labelledby={headingId}
      className={[
        'rounded-2xl border border-border bg-card p-5 shadow-sm',
        'transition-shadow duration-200 hover:shadow-md',
        section.wide ? 'md:col-span-2' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20"
        >
          <Icon className="size-5" />
        </span>

        <h4
          id={headingId}
          className="text-base font-semibold text-card-foreground sm:text-lg"
        >
          {section.title}
        </h4>
      </div>

      {!hasContent ? (
        <div
          className="flex items-start gap-2 rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground"
          role="status"
        >
          <Info
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />

          <span>{unavailableLabel}</span>
        </div>
      ) : null}

      {description ? (
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>
      ) : null}

      {items.length > 0 ? (
        <ul className="space-y-3" role="list">
          {items.map((item) => (
            <li
              key={`${section.key}-${item}`}
              className="flex items-start gap-3 text-sm leading-6 text-muted-foreground sm:text-base"
            >
              <CheckCircle
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-primary"
              />

              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

export default function DiseaseDetails({
  overview,
  causes,
  symptoms,
  prevention,
  treatmentRecommendations,
  labels,
}: DiseaseDetailsProps) {
  const sections: DetailSection[] = [
    {
      key: 'about',
      title: labels.about,
      icon: Info,
      description: overview,
      wide: true,
    },
    {
      key: 'causes',
      title: labels.causes,
      icon: AlertTriangle,
      items: causes,
    },
    {
      key: 'symptoms',
      title: labels.symptoms,
      icon: Eye,
      items: symptoms,
    },
    {
      key: 'prevention',
      title: labels.prevention,
      icon: ShieldCheck,
      items: prevention,
    },
    {
      key: 'treatment',
      title: labels.treatment,
      icon: CheckCircle,
      items: treatmentRecommendations,
    },
  ]

  return (
    <div
      aria-label={labels.about}
      className="grid gap-4 md:grid-cols-2"
      data-testid="disease-details"
    >
      {sections.map((section) => (
        <DetailCard
          key={section.key}
          section={section}
          unavailableLabel={labels.unavailable}
        />
      ))}
    </div>
  )
}
