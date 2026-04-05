'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-family: var(--font-dm-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    background-color: #F5F2E9;
    color: #2C2420;
    line-height: 1.6;
    font-family: var(--font-dm-sans), sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-playfair), serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  /* 隐藏滚动条 */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* 选中文本样式 */
  ::selection {
    background: #782221;
    color: white;
  }
`;
