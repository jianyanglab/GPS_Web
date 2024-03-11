/* eslint no-undef: 0 */
/* eslint arrow-parens: 0 */
import React from 'react';
import './index.css';
import { FrownOutlined } from '@ant-design/icons';

export default class ERROR extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 5
    };
  }

  componentDidMount() {
    // 如果匹配不到页面，自动定时请求refer方法，启动8秒倒计时
    this.timer = setInterval(() => {
      const { num } = this.state;
  
      if (num === 0){
        window.location.href = "/"; //跳转的地址
      } else {  
        this.setState({
          num: num -1
        }, () => {
          document.getElementById('show').innerHTML = `Back to <a href='/'>Homepage</a> in ${num} seconds.`; // 显示倒计时 
        });
      }
    }, 1000);
  };

  componentWillUnmount() { 
    if (this.timer != null) { 
      clearInterval(this.timer);
    }
  }

  render() {
    const children = [
      <div
        id="404"
        key="404"
        className="error-page"
      >
        <div className="not-found-container">
          <h1 className="not-found-title">404 - Page Not Found</h1>
          <div className="not-found-icon-container">
            <FrownOutlined className="not-found-icon" />
          </div>
            <p className="not-found-text">
              Unfortunately, the website you visited was lost! <span id="show"></span>
            </p>
          </div>  
      </div>,
    ];
    
    return (
      <div
        className="templates-wrapper"
        ref={(d) => {
          this.dom = d;
        }}
      >
        {children}
      </div>
    );
  }
}
