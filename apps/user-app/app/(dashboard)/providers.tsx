"use client";

import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';

export const JotaiProvider = ({
    initialValues = [],
    children
}: {
    initialValues?: [any, any][];
    children: React.ReactNode;
}) => {
    useHydrateAtoms(initialValues);
    return <Provider>{children}</Provider>;
};