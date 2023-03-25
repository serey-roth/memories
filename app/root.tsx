import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts, useCatch
} from "@remix-run/react";
import globalStylesUrl from "~/styles/global.css";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Memories",
  viewport: "width=device-width,initial-scale=1",
});

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