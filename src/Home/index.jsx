import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Button } from 'antd';
import './index.css'
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: null
    };
  }

  handleButtonClick = (page) => {
    this.setState({ redirect: page });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

    return (
      <div className="container">
        <h1 id="logo1">YANG</h1>
        <h1 id="logo2">LAB</h1>
        <div id='head'>
        <a href="https://example.com" target="_blank" id="document-link"><Button type="text"  style={{ 
          height: '38px',
          color: '#00267E', 
          fontSize:'18px', 
          fontWeight: 'bold',
          }}>Document</Button></a>
        <a href="https://example.com" target="_blank" id="github-link"><Button type="text" style={{ 
          height: '38px',
          color: '#00267E',
          fontSize:'18px', 
          fontWeight: 'bold',
          }}>Github</Button></a>
        </div>
        <p className='context'>
          <h1 id='title' style={{ 
          color: '#00267E',
          fontSize:'80px', 
          fontWeight: 'bold'
          }}>GPS</h1>
          <h2 id='second_title' style={{ 
          color: '#00267E',
          fontSize:'30px', 
          fontWeight: 'bold'
          }}>GENOME-WIDE ASSOCIATION STUDIES (GWAS)</h2>
          <h3 id='introduction' style={{ 
          color: '#5F6369',
          fontSize:'18px', 
          fontWeight: 'bold'
          }}>A genome-wide association study (abbreviated GWAS) is a research approach used to identify 
          genomic variants that are statistically associated with a risk for a disease or a particular trait. </h3>
        </p>
        <div class='buttons'>
          <Button type="default" onClick={() => this.handleButtonClick('/monkey')} style={{ 
          height: '50px',
          color: '#00267E', 
          fontSize:'22px', 
          fontWeight: 'bold',
          marginRight: '200px'
          }}>Monkey</Button>
          <Button type="default" onClick={() => this.handleButtonClick('/mouse')} style={{ 
          height: '50px',
          color: '#00267E', 
          fontSize:'22px', 
          fontWeight: 'bold',
          marginRight: '200px'
          }}>Mouse</Button>
        </div>
      </div>
    );
  }
}

export default Home;