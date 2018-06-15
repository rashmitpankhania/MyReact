import React from 'react';

import ReactDOM from 'react-dom';

import IssueList from './issuelist.jsx';

const contentNode = document.getElementById('contents');

ReactDOM.render(<IssueList />, contentNode); // Render the component inside the content Node

if (module.hot) {
  module.hot.accept();
}
