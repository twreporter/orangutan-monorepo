export class Tree {
  constructor(data) {
    this.root = new Node({
      type: 'root',
      data,
    })
  }
}

export class Node {
  /**
   *Creates an instance of Node.
   * @param {object} params
   * @param {string} params.type node type
   * @param {object} [params.data] node data
   * @memberof Node
   */
  constructor({ type, data }) {
    this.parent = null
    this.children = []
    this.type = type
    this.data = data
  }

  /**
   *
   *
   * @param {...Node} nodes
   * @returns {Node}
   * @memberof Node
   */
  append(...nodes) {
    this.children.push(...nodes)
    nodes.forEach(node => {
      node.parent = this
    })
    return this
  }

  /**
   *
   *
   * @param {Node} node
   * @returns {Node}
   * @memberof Node
   */
  appendTo(node) {
    node.children.push(this)
    this.parent = node
    return this
  }

  /**
   *
   *
   * @param {function(Node): boolean} testing
   * @returns {Node|null}
   * @memberof Node
   */
  findAncestor(testing) {
    if (testing(this)) {
      return this
    } else if (!this.parent) {
      return null
    } else {
      return this.parent.findAncestor(testing)
    }
  }
}
