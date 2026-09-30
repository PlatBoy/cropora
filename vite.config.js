import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function localizeJsxPlugin({ types }) {
  const textAttributes = new Set(["alt", "aria-description", "aria-label", "placeholder", "title"]);
  const wrap = (expression) => types.callExpression(types.identifier("localize"), [expression]);
  const isWrapped = (expression) =>
    types.isCallExpression(expression)
    && types.isIdentifier(expression.callee, { name: "localize" });

  return {
    name: "krishisense-jsx-localization",
    visitor: {
      JSXText(path) {
        if (!path.node.value.trim()) return;
        path.replaceWith(types.jsxExpressionContainer(wrap(types.stringLiteral(path.node.value))));
      },
      JSXExpressionContainer(path) {
        if (path.parentPath.isJSXAttribute() || types.isJSXEmptyExpression(path.node.expression) || isWrapped(path.node.expression)) return;
        path.node.expression = wrap(path.node.expression);
      },
      JSXAttribute(path) {
        if (!textAttributes.has(path.node.name.name)) return;
        if (types.isStringLiteral(path.node.value)) {
          path.node.value = types.jsxExpressionContainer(wrap(path.node.value));
        } else if (types.isJSXExpressionContainer(path.node.value) && !isWrapped(path.node.value.expression)) {
          path.node.value.expression = wrap(path.node.value.expression);
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [react({ babel: { plugins: [localizeJsxPlugin] } })],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
});
