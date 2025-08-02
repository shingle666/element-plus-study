# Typography

## Overview

The Typography component is used to standardize and unify the presentation of text, providing a complete text style system including headings, paragraphs, quotes, code, and more.

## Basic Usage

```vue
<template>
  <div>
    <h1>Heading Level 1</h1>
    <h2>Heading Level 2</h2>
    <h3>Heading Level 3</h3>
    <p>This is an example paragraph text.</p>
  </div>
</template>
```

## Text Styles

The Typography component provides various text styles, including different font sizes, weights, line heights, and more.

## Responsive Design

The Typography component supports responsive design, automatically adjusting text styles based on different screen sizes.

## API Reference

### Properties

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| size | Text size | string | normal |
| weight | Font weight | string/number | normal |
| italic | Whether to use italic style | boolean | false |

### Events

| Event Name | Description | Parameters |
| --- | --- | --- |
| click | Triggered when text is clicked | event: Event |

### Slots

| Slot Name | Description |
| --- | --- |
| default | Default slot for text content |
