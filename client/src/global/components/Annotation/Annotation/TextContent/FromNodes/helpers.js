import isEqual from "lodash/isEqual";

export const deepCopyChildren = n => ({
  ...n,
  children: n.children ? n.children.map(deepCopyChildren) : undefined
});

export const findNestedNode = (nodes, target) => {
  const result = nodes
    .map(n => {
      if (n.nodeUuid === target) return n;
      if (n.children) return findNestedNode(n.children, target).flat();
      return [];
    })
    .flat();
  return result;
};

export const findTextNode = (nodes, target) => {
  return findNestedNode(nodes, target)[0];
};

export const findNestedMatchIndex = (nodes, target) => {
  return nodes.findIndex(n => {
    return (
      n.nodeUuid === target ||
      (n.children && findNestedMatchIndex(n.children, target) >= 0)
    );
  });
};

const maybeTruncateChildren = (node, target, start = true) => {
  if (!node.children || node.children?.length <= 1) return node;
  const index = findNestedMatchIndex(node.children, target);
  if (start) return { ...node, children: node.children.slice(index) };
  return { ...node, children: node.children.slice(0, index + 1) };
};

const findParentNode = (node, childId) => {
  if (!node.children?.length) return [];
  const result = node.children
    .map(n => {
      if (n.nodeUuid === childId) return node;
      if (n.children) return findParentNode(n, childId).flat();
      return [];
    })
    .flat();
  return result;
};

const findParentOfElement = (node, element) => {
  if (!node.children?.length) return [];
  const result = node.children
    .map(n => {
      if (isEqual(n, element)) return node;
      if (n.children) return findParentOfElement(n, element).flat();
      return [];
    })
    .flat();
  return result;
};

export const findAncestorNode = (bodyNode, startNode, endNode) => {
  if (typeof startNode === "string") {
    const startNodeParent = findParentNode(bodyNode, startNode)[0];
    const endNodeParent = findParentNode(bodyNode, endNode)[0];
    if (isEqual(startNodeParent, endNodeParent)) return startNodeParent;
    return findAncestorNode(bodyNode, startNodeParent, endNodeParent);
  }
  const startNodeParent = findParentOfElement(bodyNode, startNode)[0];
  const endNodeParent = findParentOfElement(bodyNode, endNode)[0];
  if (isEqual(startNodeParent, endNodeParent)) return startNodeParent;
  return findAncestorNode(bodyNode, startNodeParent, endNodeParent);
};

export const findStartOrEndNode = (nodes, target, start = true) => {
  const index = findNestedMatchIndex(nodes, target);
  if (index === -1) return [-1, null];
  return [index, maybeTruncateChildren(nodes[index], target, start)];
};

const truncateStart = (content, startChar, limit) => {
  const split = content.lastIndexOf(".", startChar - limit);
  if (split === -1) return { content };
  return { content: content.substring(split + 1), split };
};

const truncateEnd = (content, endChar, limit) => {
  const split = content.indexOf(".", endChar + limit);
  if (split === -1) return content;
  return content.substring(0, split + 1);
};

const maybeTruncateStart = (node, startChar, limit) => {
  if (node.children?.length) {
    const startNode = node.children.shift();
    const { adjustedNode: adjustedStartNode, split } = maybeTruncateStart(
      startNode,
      startChar,
      limit
    );
    return {
      adjustedNode: {
        ...node,
        children: [adjustedStartNode, ...node.children]
      },
      split
    };
  }
  if (node.content) {
    const { content, split } = truncateStart(node.content, startChar, limit);
    return { adjustedNode: { ...node, content }, split };
  }
};

const maybeTruncateEnd = (node, endChar, limit) => {
  if (!endChar) return { adjustedNode: node };
  if (node.children?.length) {
    const endNode = node.children.pop();
    const adjustedEndNode = maybeTruncateEnd(endNode, endChar, limit)
      .adjustedNode;
    return {
      adjustedNode: { ...node, children: [...node.children, adjustedEndNode] }
    };
  }
  if (node.content) {
    if (node.content.length - endChar < limit) return { adjustedNode: node };
    return {
      adjustedNode: {
        ...node,
        content: truncateEnd(node.content, endChar, limit)
      }
    };
  }
};

export const maybeTruncate = (node, startChar, endChar, limit = 100) => {
  if (!startChar || startChar < limit) {
    return maybeTruncateEnd(node, endChar, limit);
  }
  return maybeTruncateStart(
    maybeTruncateEnd(node, endChar, limit).adjustedNode,
    startChar,
    limit
  );
};