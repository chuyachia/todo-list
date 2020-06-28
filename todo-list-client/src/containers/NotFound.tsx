import React from 'react';
import {Link} from 'react-router-dom';

const NotFound: React.FC<{}> = () => (<article>
    <p>The page you are looking for does not exist</p>
    <p>Go to <Link to={'/todos'} className={'clickable'}>home page</Link></p>
</article>);

export default NotFound;