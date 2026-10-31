'use client';

import { useState } from 'react';
import { Field } from '@/components/ui/field';
import { SearchInput } from '@/components/ui/search-input';
import { devCopy } from '@/content/dev';

const copy = devCopy.traffic;

/** A search field with its own state, for the gallery. */
export function DemoSearchInput() {
  const [value, setValue] = useState('');
  return (
    <Field label={copy.searchLabel} className="w-full sm:w-80">
      <SearchInput
        name="sample-search"
        placeholder={copy.searchPlaceholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onClear={() => setValue('')}
      />
    </Field>
  );
}
