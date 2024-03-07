import './App.css'
import { useState, useCallback } from 'react'

import { useSearch } from './hooks/useSearch'
import { useMovies } from './hooks/useMovies'

import { Movies } from './components/movies'

import debounce from 'just-debounce-it'


function App () {
  const [sort, setSort] = useState(false)

  const { search, updateSearch, error } = useSearch()
  const { movies, loading, getMovies } = useMovies({ search, sort })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedGetMovies = useCallback(
    debounce((search) => {
      console.log('search', search)
      getMovies({ search })
    }, 500),
    [getMovies]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log({ search })
    getMovies({ search })
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  }

  return (
    <div className='page'>
      <header>
        <h1>Buscador de peliculas</h1>
        <form className='form' onSubmit={handleSubmit}>
          <input
            style={{
              border: '1px solid transparent',
              borderColor: error ? 'red' : 'transparent'
            }}
            onChange={handleChange} value={search} name='query' placeholder='Avengers, Star Wars, The matrix...'
          />

          <input type='checkbox' onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>

        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }
      </main>

    </div>
  )
}

export default App
