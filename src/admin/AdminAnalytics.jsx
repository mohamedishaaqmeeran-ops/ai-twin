import {
  TrendingUp,
  IndianRupee,
  ShoppingCart,
  Eye,
  Users,
  Radio,
  Instagram,
  Youtube,
  Facebook,
  Music2,
  Bot,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹12,45,600",
    icon: IndianRupee,
    color: "text-emerald-500",
  },
  {
    title: "Orders",
    value: "2,845",
    icon: ShoppingCart,
    color: "text-blue-500",
  },
  {
    title: "Live Views",
    value: "84.5K",
    icon: Eye,
    color: "text-pink-500",
  },
  {
    title: "Users",
    value: "9,540",
    icon: Users,
    color: "text-orange-500",
  },
];

const products = [
  {
    name: "Vitamin C Glow Serum",
    sales: 542,
    revenue: "₹4,32,000",
  },
  {
    name: "Wireless Headphone",
    sales: 382,
    revenue: "₹3,18,000",
  },
  {
    name: "Smart Watch",
    sales: 290,
    revenue: "₹2,64,000",
  },
];

const platforms = [
  {
    icon: Instagram,
    name: "Instagram",
    views: "35K",
  },
  {
    icon: Youtube,
    name: "YouTube",
    views: "28K",
  },
  {
    icon: Facebook,
    name: "Facebook",
    views: "12K",
  },
  {
    icon: Music2,
    name: "TikTok",
    views: "9K",
  },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-4xl font-black brand-text">
          Analytics Dashboard
        </h1>

        <p className="mt-2 text-sm font-medium text-muted-foreground">
          Revenue, AI performance, live commerce and conversion insights.
        </p>
      </div>

      {/* Stats */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-3xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-muted-foreground">
                    {item.title}
                  </p>

                  <h2 className="mt-3 text-3xl font-black">
                    {item.value}
                  </h2>

                </div>

                <div className="rounded-2xl bg-pink-50 p-4 dark:bg-white/10">
                  <Icon className={`h-7 w-7 ${item.color}`} />
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Chart */}

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

        <div className="flex items-center justify-between">

          <h2 className="text-2xl font-black brand-text">
            Revenue Overview
          </h2>

          <TrendingUp className="h-7 w-7 text-[var(--brand-pink)]" />

        </div>

        <div className="mt-8 flex h-72 items-end justify-between rounded-2xl bg-pink-50 p-6 dark:bg-white/10">

          {[20,40,55,38,62,80,55,90,75,100].map((item,index)=>(

            <div
              key={index}
              className="brand-gradient w-8 rounded-t-xl"
              style={{
                height:`${item}%`
              }}
            />

          ))}

        </div>

      </div>

      {/* Platform Analytics */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <h2 className="text-2xl font-black brand-text">
            Platform Views
          </h2>

          <div className="mt-6 space-y-4">

            {platforms.map((item)=>{

              const Icon=item.icon;

              return(

                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl border border-border bg-background p-4"
                >

                  <div className="flex items-center gap-3">

                    <Icon className="h-6 w-6 text-[var(--brand-pink)]"/>

                    <span className="font-bold">
                      {item.name}
                    </span>

                  </div>

                  <span className="font-black brand-text">
                    {item.views}
                  </span>

                </div>

              )

            })}

          </div>

        </div>

        {/* AI Performance */}

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-black brand-text">
              AI Twin Performance
            </h2>

            <Bot className="h-7 w-7 text-[var(--brand-pink)]"/>

          </div>

          <div className="mt-6 space-y-5">

            <Progress title="Response Accuracy" value={98} />

            <Progress title="Conversion Rate" value={84} />

            <Progress title="Customer Satisfaction" value={96} />

            <Progress title="Live Engagement" value={88} />

          </div>

        </div>

      </div>

      {/* Top Products */}

      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

        <h2 className="text-2xl font-black brand-text">
          Top Selling Products
        </h2>

        <div className="mt-6 overflow-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="py-4 text-left">Product</th>
                <th className="py-4 text-left">Sales</th>
                <th className="py-4 text-left">Revenue</th>

              </tr>

            </thead>

            <tbody>

              {products.map((item)=>(

                <tr
                  key={item.name}
                  className="border-b border-border"
                >

                  <td className="py-5 font-bold">
                    {item.name}
                  </td>

                  <td>{item.sales}</td>

                  <td className="font-black brand-text">
                    {item.revenue}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* Live Summary */}

      <div className="grid gap-5 md:grid-cols-3">

        <Summary
          title="Active Live Sessions"
          value="24"
          icon={Radio}
        />

        <Summary
          title="Conversion Rate"
          value="18.4%"
          icon={TrendingUp}
        />

        <Summary
          title="Total AI Twins"
          value="1,248"
          icon={Bot}
        />

      </div>

    </div>
  );
}

function Progress({title,value}){

  return(

    <div>

      <div className="mb-2 flex justify-between">

        <span className="font-bold">
          {title}
        </span>

        <span className="font-black brand-text">
          {value}%
        </span>

      </div>

      <div className="h-2 rounded-full bg-pink-100 dark:bg-white/10">

        <div
          className="brand-gradient h-2 rounded-full"
          style={{
            width:`${value}%`
          }}
        />

      </div>

    </div>

  )

}

function Summary({title,value,icon:Icon}){

  return(

    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-black">
            {value}
          </h2>

        </div>

        <div className="rounded-2xl bg-pink-50 p-4 dark:bg-white/10">

          <Icon className="h-7 w-7 text-[var(--brand-pink)]"/>

        </div>

      </div>

    </div>

  )

}