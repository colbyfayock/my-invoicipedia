"use client";

import Error, { ErrorProps } from 'next/error'

export default function Page(props: ErrorProps) {
  return <Error statusCode={props.statusCode || 500} />
}