import * as React from 'react';

export default class Jdenticon extends React.Component<any, {}> {
  private el = null
  public componentDidUpdate() {
    (window as any).jdenticon.update(this.el)
  }

  public componentDidMount() {
    (window as any).jdenticon.update(this.el)
  }

  public render () {
    const {hash, size} = this.props
    return <svg
      {...this.props}
      style={{verticalAlign: 'middle'}}
      ref={el => this.handleRef(el)}
      width={size}
      height={size}
      data-jdenticon-value={hash}
      />
  }

  private handleRef (el) {
    this.el = el
  }
}
