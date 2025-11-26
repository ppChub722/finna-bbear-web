'use client'

export function DesignSheetView() {
  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Typography</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Heading 1
            </h1>
            <p className="text-muted-foreground">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight first:mt-0">
              Heading 2
            </h2>
            <p className="text-muted-foreground">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold tracking-tight">Heading 3</h3>
            <p className="text-muted-foreground">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-semibold tracking-tight">Heading 4</h4>
            <p className="text-muted-foreground">
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
          <div className="space-y-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Paragraph: Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Colors</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <ColorCard
            name="Background"
            className="bg-background border"
            textClassName="text-foreground"
          />
          <ColorCard
            name="Foreground"
            className="bg-foreground"
            textClassName="text-background"
          />
          <ColorCard
            name="Primary"
            className="bg-primary"
            textClassName="text-primary-foreground"
          />
          <ColorCard
            name="Secondary"
            className="bg-secondary"
            textClassName="text-secondary-foreground"
          />
          <ColorCard
            name="Muted"
            className="bg-muted"
            textClassName="text-muted-foreground"
          />
          <ColorCard
            name="Accent"
            className="bg-accent"
            textClassName="text-accent-foreground"
          />
          <ColorCard
            name="Destructive"
            className="bg-destructive"
            textClassName="text-destructive-foreground"
          />
          <ColorCard
            name="Border"
            className="bg-border"
            textClassName="text-foreground"
          />
          <ColorCard
            name="Input"
            className="bg-input"
            textClassName="text-foreground"
          />
          <ColorCard
            name="Ring"
            className="bg-ring"
            textClassName="text-background"
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Radius</h2>
        <div className="flex flex-wrap gap-4">
          <div className="bg-primary text-primary-foreground flex h-24 w-24 items-center justify-center rounded-sm text-xs">
            sm
          </div>
          <div className="bg-primary text-primary-foreground flex h-24 w-24 items-center justify-center rounded-md text-xs">
            md
          </div>
          <div className="bg-primary text-primary-foreground flex h-24 w-24 items-center justify-center rounded-lg text-xs">
            lg
          </div>
          <div className="bg-primary text-primary-foreground flex h-24 w-24 items-center justify-center rounded-full text-xs">
            full
          </div>
        </div>
      </section>
    </div>
  )
}

function ColorCard({
  name,
  className,
  textClassName,
}: {
  name: string
  className: string
  textClassName: string
}) {
  return (
    <div
      className={`rounded-lg p-4 shadow-sm ${className} flex h-24 flex-col justify-between`}
    >
      <span className={`font-medium ${textClassName}`}>{name}</span>
    </div>
  )
}
