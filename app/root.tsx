import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts, ScrollRestoration, useCatch
} from "@remix-run/react";
import globalStylesUrl from "~/styles/global.css";

export const meta: MetaFunction = () => {
  const description = "Memories with Remix: Capture the moment!";
  return {
    charset: "utf-8",
    description,
    keywords: "Remix,memories",
    "twitter:card": "summary_large_image",
    "twitter:creator": "@remix_run",
    "twitter:site": "@remix_run",
    "twitter:title": "Memories",
    "twitter:description": description,
  };
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl }
];

function Document({
  children,
  title = `Memories: Capture the moment!`,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <Scripts />
        <ScrollRestoration getKey={(location) => location.pathname}/>
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Uh-oh!">
      <div className="error-container">
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </div>
    </Document>
  );
}

//fallback
export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document
      title={`${caught.status} ${caught.statusText}`}
    >
      <div className="error-container">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
      </div>
    </Document>
  );
}