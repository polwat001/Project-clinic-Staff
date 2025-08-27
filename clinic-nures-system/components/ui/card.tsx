// components/ui/card.tsx
import React from "react";

export function Card(props) {
  return <div className="border rounded-lg shadow-sm p-4 bg-white" {...props}>{props.children}</div>;
}

export function CardHeader(props) {
  return <div className="mb-2 font-semibold">{props.children}</div>;
}

export function CardTitle(props) {
  return <h3 className="text-lg font-bold">{props.children}</h3>;
}

export function CardContent(props) {
  return <div>{props.children}</div>;
}
export function CardFooter(props) {
  return <div className="mt-4 text-right">{props.children}</div>;
}