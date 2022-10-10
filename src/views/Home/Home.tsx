import { Link } from 'react-router-dom'

export default function Home(): JSX.Element {
  return (
    <div className="container">
      <Link to={'/0-hello-canvas'}>
        0-hello-canvas
      </Link>
    </div>
  )
}
