import { Link } from 'react-router-dom'

export default function Home(): JSX.Element {
  return (
    <div className="container">
      <ul>
        <li>
          <Link to={'/0-hello-canvas'}>0-hello-canvas</Link>
        </li>
        <li>
          <Link to={'/1-hello-point'}>1-hello-point</Link>
        </li>
        <li>
          <Link to={'/2-checked-points'}>2-checked-points</Link>
        </li>
      </ul>
    </div>
  )
}
