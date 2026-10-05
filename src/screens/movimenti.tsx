import * as React from "react"
import { RiHistoryLine } from "@remixicon/react"

import { PageBody, PageHeader } from "@/screens/app-shell"
import { MovementRow } from "@/components/fidelia/movement-row"
import { PointsOdometer } from "@/components/fidelia/points-odometer"
import { Card, CardContent } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { ItemGroup } from "@/components/ui/item"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { monthKey } from "@/lib/format"
import { navigate } from "@/mock/router"
import { useStore } from "@/mock/store"
import { fmtPoints } from "@/lib/utils"

type Filter = "tutti" | "plus" | "minus"

export function MovimentiScreen() {
  const { user, movements } = useStore()
  const [filter, setFilter] = React.useState<Filter>("tutti")
  const list = movements.filter((m) => (filter === "plus" ? m.points > 0 : filter === "minus" ? m.points < 0 : true))
  const groups = list.reduce<Record<string, typeof list>>((acc, m) => {
    ;(acc[monthKey(m.date)] ??= []).push(m)
    return acc
  }, {})

  return (
    <>
      <PageHeader title="Saldo e movimenti" onBack={() => navigate("tessera")} />
      <PageBody className="lg:grid lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start lg:gap-8">
        <Card className="border-0 bg-brand text-brand-foreground ring-0 lg:sticky lg:top-10 dark:ring-1 dark:ring-white/10">
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <span className="text-sm opacity-90">Saldo disponibile</span>
              <PointsOdometer value={user.points} className="text-[56px] text-highlight" />
            </div>
            <dl className="grid grid-cols-3 gap-2">
              {[
                ["Accumulati", fmtPoints(user.totalEarned)],
                ["Riscattati", fmtPoints(user.totalRedeemed)],
                ["Visite", String(user.visits)],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col gap-0.5 rounded-2xl bg-white/12 px-3 py-2.5">
                  <dt className="text-xs opacity-90">{k}</dt>
                  <dd className="font-heading text-lg font-bold tabular">{v}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <section aria-label="Elenco movimenti" className="flex flex-col gap-4">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
            <TabsList className="w-full sm:w-fit">
              <TabsTrigger value="tutti">Tutti</TabsTrigger>
              <TabsTrigger value="plus">Accumulati</TabsTrigger>
              <TabsTrigger value="minus">Riscattati</TabsTrigger>
            </TabsList>
          </Tabs>

          {list.length === 0 ? (
            <Empty>
              <EmptyMedia>
                <RiHistoryLine />
              </EmptyMedia>
              <EmptyTitle>Nessun premio riscattato</EmptyTitle>
              <EmptyDescription>Quando riscatti un premio in cassa, lo trovi qui con i punti scalati.</EmptyDescription>
            </Empty>
          ) : (
            Object.entries(groups).map(([month, items]) => (
              <div key={month} className="flex flex-col gap-2">
                <h2 className="px-1 text-sm font-semibold text-muted-foreground">{month}</h2>
                <Card size="sm" className="py-1.5">
                  <ItemGroup className="px-1.5">
                    {items.map((m) => (
                      <MovementRow key={m.id} m={m} />
                    ))}
                  </ItemGroup>
                </Card>
              </div>
            ))
          )}
        </section>
      </PageBody>
    </>
  )
}
