

# Getting started with Vercel Web Analytics

This guide will help you get started with using Vercel Web Analytics on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.

Select your framework to view instructions on using the Vercel Web Analytics in your project.

Agent Prompt

Help me add Vercel Web Analytics to this project. First, make sure the Vercel CLI is installed (\`npm i -g vercel\`). If I'm using Claude Code or Cursor, install the Vercel Plugin (\`npx plugins add vercel/vercel-plugin\`). For other agents, install Vercel Skills (\`npx skills add vercel-labs/agent-skills\`). Then: 1. Install @vercel/analytics. 2. Add the Analytics component to my root layout. 3. Deploy with \`vercel --prod\` and verify analytics data appears in the Vercel dashboard.

Show more

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:

pnpmyarnnpmbun

Terminal

```
pnpm i -g vercel
```

Terminal

```
yarn global add vercel
```

Terminal

```
npm i -g vercel
```

Terminal

```
bun add -g vercel
```

Version 2 package updates are available. For details, see [What's new in version 2](/docs/analytics/package#what's-new-in-version-2.x).

## Set up your project

1. ### Enable Web Analytics in Vercel
   
   On the Vercel dashboard, navigate to Analytics in the sidebar and select a project. Or select the button below to go there.
   
   [Go to Web Analytics](/d?to=%2F%5Bteam%5D%2F%5Bproject%5D%2Fanalytics&title=Open+Web+Analytics)
   
   Then click the Enable button in the header.
   
   Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*` and `/<unique-path>/*`) after your next deployment.
   
2. ### Add @vercel/analytics to your project
   
   Using the package manager of your choice, add the `@vercel/analytics` package to your project:
   
   pnpmyarnnpmbun
   
   Terminal
   
   ```
   pnpm i @vercel/analytics
   ```
   
   Terminal
   
   ```
   yarn add @vercel/analytics
   ```
   
   Terminal
   
   ```
   npm i @vercel/analytics
   ```
   
   Terminal
   
   ```
   bun add @vercel/analytics
   ```
   
3. ### Add the Analytics component to your app
   
   The `Analytics` component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.
   
   If you are using the `pages` directory, add the following code to your main app file:
   
   pages/\_app.tsx
   
   Next.js (/pages)
   
   Next.js (/app)Next.js (/pages)SvelteKitCreate React AppNuxtVueRemixAstroHTMLOther frameworks
   
   TypeScript
   
   TypeScriptJavaScriptBash
   
   ```
   import type { AppProps } from 'next/app';
   import { Analytics } from '@vercel/analytics/next';
    
   function MyApp({ Component, pageProps }: AppProps) {
     return (
       <>
         <Component {...pageProps} />
         <Analytics />
       </>
     );
   }
    
   export default MyApp;
   ```
   
4. ### Deploy your app to Vercel
   
   Deploy your app using the following command:
   
   terminal
   
   ```
   vercel deploy
   ```
   
   If you haven't already, we also recommend [connecting your project's Git repository](/docs/git#deploying-a-git-repository), which will enable Vercel to deploy your latest commits to main without terminal commands.
   
   Once your app is deployed, it will start tracking visitors and page views.
   
   If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from `/<unique-path>/view` when you visit any page.
   
5. ### View your data in the dashboard
   
   Once your app is deployed, and users have visited your site, you can view your data in the dashboard.
   
   To do so, go to your [dashboard](/dashboard), select your project, and click [Analytics](https://vercel.com/d?to=%2F%5Bteam%5D%2F%5Bproject%5D%2Fanalytics&title=Go+to+Analytics) in the sidebar.
   
   After a few days of visitors, you'll be able to start exploring your data by viewing and [filtering](/docs/analytics/filtering) the panels.
   
   Users on Pro and Enterprise plans can also add [custom events](/docs/analytics/custom-events) to their data to track user interactions such as button clicks, form submissions, or purchases.
   

Learn more about how Vercel supports [privacy and data compliance standards](/docs/analytics/privacy-policy) with Vercel Web Analytics.

## Next steps

Now that you have Vercel Web Analytics set up, you can explore the following topics to learn more:

- [Explore your analytics dashboard](/docs/analytics/using-web-analytics)
- [Learn how to set up custom events](/docs/analytics/custom-events)
- [Learn how to redact sensitive data](/docs/analytics/redacting-sensitive-data)
- [Read about privacy and compliance](/docs/analytics/privacy-policy)
- [Learn how to configure your client-side package](/docs/analytics/package)
- [Explore pricing](/docs/analytics/limits-and-pricing)
- [Troubleshooting](/docs/analytics/troubleshooting)

Related Vercel documentation

## Cross-link map: Getting started with Vercel Web Analytics (/docs/analytics/quickstart)

> From the Vercel docs graph (built 2026-09-04T06:39:20.862Z), spanning vercel.com docs + KB, nextjs.org, ai-sdk.dev, and other Vercel documentation sites. Full graph as JSON: [https://vercel.com/docs/graph.json](https://vercel.com/docs/graph.json)

### Semantically closest pages

- [Getting started with Speed Insights](https://vercel.com/docs/speed-insights/quickstart?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=semantic&surface=html) — Vercel Speed Insights provides you detailed insights into your website's performance. This quickstart guide will help yo
- [Using Web Analytics](https://vercel.com/docs/analytics/using-web-analytics?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=semantic&surface=html) — Learn how to use Vercel's Web Analytics to understand how visitors are using your website.
- [Vercel Web Analytics Troubleshooting](https://vercel.com/docs/analytics/troubleshooting?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=semantic&surface=html) — Learn how to troubleshoot common issues with Vercel Web Analytics.
- [Create React App on Vercel](https://vercel.com/docs/frameworks/frontend/create-react-app?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=semantic&surface=html) — Deploy Create React App projects to Vercel and add Preview Deployments, Web Analytics, Speed Insights, and Observability
- [Vercel Web Analytics](https://vercel.com/docs/analytics?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=semantic&surface=html) — With Web Analytics, you can get detailed insights into your website's visitors with new metrics like top pages, top refe

### This page links to (9)

- [Tracking custom events](https://vercel.com/docs/analytics/custom-events?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=outbound&surface=html) — Learn how to send custom analytics events from your application.
- [Filtering Analytics](https://vercel.com/docs/analytics/filtering?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=outbound&surface=html) — Learn how filters allow you to explore insights about your website's visitors.
- [Pricing for Web Analytics](https://vercel.com/docs/analytics/limits-and-pricing?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=outbound&surface=html) — Learn about pricing for Vercel Web Analytics.
- [Advanced Web Analytics Config with @vercel/analytics](https://vercel.com/docs/analytics/package?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=outbound&surface=html) — With the @vercel/analytics npm package, you are able to configure your application to send analytics data to Vercel.
- [Privacy and Compliance](https://vercel.com/docs/analytics/privacy-policy?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=outbound&surface=html) — Learn how Vercel supports privacy and data compliance standards with Vercel Web Analytics.
- [Redacting Sensitive Data from Web Analytics Events](https://vercel.com/docs/analytics/redacting-sensitive-data?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=outbound&surface=html) — Learn how to redact sensitive data from your Web Analytics events.
- [Vercel Web Analytics Troubleshooting](https://vercel.com/docs/analytics/troubleshooting?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=outbound&surface=html) — Learn how to troubleshoot common issues with Vercel Web Analytics.
- [Using Web Analytics](https://vercel.com/docs/analytics/using-web-analytics?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=outbound&surface=html) — Learn how to use Vercel's Web Analytics to understand how visitors are using your website.
- [Deploying Git Repositories with Vercel](https://vercel.com/docs/git?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=outbound&surface=html) — Vercel automatically deploys supported Git repositories on every branch push and when changes merge into the production

### Pages that link here (13)

By site: vercel-changelog (2) · vercel-docs (11)

#### From vercel-changelog

- [Improved data collection for Web Analytics and Speed Insights with resilient intake](https://vercel.com/changelog/improved-data-collection-for-web-analytics-and-speed-insights-with-resilient?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html)
- [Preview your site's Firewall status and Web Analytics from the Project Overview](https://vercel.com/changelog/preview-firewall-status-and-web-analytics-from-project-overview?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html)

#### From vercel-docs

- [Vercel Web Analytics](https://vercel.com/docs/analytics?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html) — With Web Analytics, you can get detailed insights into your website's visitors with new metrics like top pages, top refe
- [Tracking custom events](https://vercel.com/docs/analytics/custom-events?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to send custom analytics events from your application.
- [Filtering Analytics](https://vercel.com/docs/analytics/filtering?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how filters allow you to explore insights about your website's visitors.
- [Advanced Web Analytics Config with @vercel/analytics](https://vercel.com/docs/analytics/package?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html) — With the @vercel/analytics npm package, you are able to configure your application to send analytics data to Vercel.
- [Privacy and Compliance](https://vercel.com/docs/analytics/privacy-policy?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how Vercel supports privacy and data compliance standards with Vercel Web Analytics.
- [Vercel Web Analytics Troubleshooting](https://vercel.com/docs/analytics/troubleshooting?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to troubleshoot common issues with Vercel Web Analytics.
- [Query Web Analytics with the API](https://vercel.com/docs/analytics/web-analytics-api?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how Web Analytics concepts map to API queries for custom reports, dashboards, and insights.
- [Managing Deployments](https://vercel.com/docs/deployments/managing-deployments?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to manage your current and previously deployed projects to Vercel through the dashboard. You can redeploy at a
- [Astro on Vercel](https://vercel.com/docs/frameworks/frontend/astro?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html) — Deploy Astro sites to Vercel and configure server-side rendering, ISR, Web Analytics, Image Optimization, and Routing Mi
- [Create React App on Vercel](https://vercel.com/docs/frameworks/frontend/create-react-app?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html) — Deploy Create React App projects to Vercel and add Preview Deployments, Web Analytics, Speed Insights, and Observability
- [Vercel Documentation Sitemap](https://vercel.com/docs/sitemap.md?from=graph&source_path=%2Fdocs%2Fanalytics%2Fquickstart&source_site=vercel-docs&relationship=inbound&surface=html) — Browse Vercel documentation pages with summaries, prerequisites, and topics.