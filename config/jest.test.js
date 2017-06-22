import React from 'react'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

// This file can be used as a "cheat sheet" of the various apis used for testing in this project
// It also will help surface if anything isn't working as expected.

// ------------------------------------
// Basic Jest API
// ------------------------------------

// Jest api: https://facebook.github.io/jest/docs/api.html
// There are a couple of more rare/advanced examples not shown here
it('A standalone test. I recommend wrapping in a describe.', () => {
  const sum = (a, b) => a + b

  expect(sum(1, 2)).toBe(3)
})

describe('Test Globals', () => {
  it('it can be used to create a test', () => {
    // a blank "it" will pass by default
    // You may return only a Promise or undefined
  })

  xit('this test will be skipped', () => {
    throw new Error('Luckily this is skipped, or it would break')
  })

  // Used `fit` to run ONLY that test
  // fit('only I will be ran', () => { })
})

describe('Basic Matchers', () => {
  it('.toBe is ===', () => {
    expect('1234').toBe('1234')
  })

  it('.not is the inverse, IE: .not.toBe is !==', () => {
    expect('1234').not.toBe(1234)
  })

  it('.toBeDefined', () => {
    expect('a value').toBeDefined()
    expect(undefined).not.toBeDefined()
  })

  it('.toBeNull', () => {
    expect(null).toBeNull()
  })

  it('.toBeGreaterThan', () => {
    expect(11).toBeGreaterThan(10)
  })

  it('.toBeGreaterThanOrEqual', () => {
    expect(10).toBeGreaterThanOrEqual(10)
  })

  it('.toBeLessThan', () => {
    expect(10).toBeLessThan(11)
  })

  it('.toBeLessThanOrEqual', () => {
    expect(11).toBeLessThanOrEqual(11)
  })

  it('.toBeTruthy (1 == true)', () => {
    expect(1).toBeTruthy()
    expect(1).not.toBe(true)
  })

  it('.toBeFalsy: (false || 0 || \'\' || null || undefined || NaN)', () => {
    expect(false || 0 || '' || null || undefined || NaN).toBeFalsy()
    expect('').toBeFalsy()
  })

  it('.toEqual (Deep Equality check)', () => {
    const thing1 = { thing: 'value' }
    const thing2 = { thing: 'value' }

    expect(thing1).toEqual(thing2)
    expect(thing1).not.toBe(thing2)
  })

  it('.toMatch (Regexp)', () => {
    expect('string').toMatch(/ing/)
  })

  it('.toHaveLength', () => {
    expect([1, 2, 3]).toHaveLength(3)
  })

  it('.toContain (item in array)', () => {
    expect(['orange', 'apple', 'pineapple']).toContain('apple')
  })

  it('.toContainEqual (deep equal in array)', () => {
    expect([{ age: 16 }, { age: 21 }]).toContainEqual({ age: 21 })
  })

  it('.toMatchObject (match a subset of props)', () => {
    const houseForSale = {
      bath: true,
      kitchen: {
        amenities: ['oven', 'stove', 'washer'],
        area: 20,
        wallColor: 'white',
      },
      bedrooms: 4,
    }
    const desiredHouse = {
      bath: true,
      kitchen: {
        amenities: ['oven', 'stove', 'washer'],
        wallColor: 'white',
      },
    }

    expect(houseForSale).toMatchObject(desiredHouse)
  })

  it('.toThrow', () => {
    const someFunction = () => {
      throw new Error('BAM!')
    }

    expect(() => someFunction()).toThrow()
  })
})

// ------------------------------------
// Function Spies
// ------------------------------------
describe('Function spies', () => {
  it('.toBeCalled', () => {
    const someFunction = jest.fn()
    someFunction()

    expect(someFunction).toBeCalled()
  })

  it('.toBeCalledWith', () => {
    const someFunction = jest.fn()
    someFunction('value')

    expect(someFunction).toBeCalledWith('value')
  })

  it('.toHaveBeenCalledTimes', () => {
    const someFunction = jest.fn()
    someFunction()
    someFunction()

    expect(someFunction).toHaveBeenCalledTimes(2)
  })

  it('.toHaveBeenLastCalledWith', () => {
    const someFunction = jest.fn()

    someFunction()
    someFunction('value')
    expect(someFunction).toHaveBeenLastCalledWith('value')

    someFunction('anotherValue')
    expect(someFunction).not.toHaveBeenLastCalledWith('value')
  })
})

// ------------------------------------
// Component Testing
// ------------------------------------
const ExampleInner = () => (
  <div
    onClick={() => {
      console.log('You clicked me')
    }}
  >
    Inner Element
  </div>
)

// eslint-disable-next-line react/prop-types
const ExampleOuter = ({ name }) => (
  <div>
    Outer Element - {name}
    <ExampleInner />
  </div>
)

/*
  Enzyme docs: https://github.com/airbnb/enzyme/tree/master/docs
  Enzyme is used to render react components for tests. It creates
  a Jquery style wrapper to help find and test elments
  It has 3 render methods that are global in tests:
  - Shallow
  - Mount
  - Render

  These combined with Jest's snapshot diffs make for easy component
  testing!

  So my rule of thumbs is:

** RULES OF THUMB
  - Always begin with shallow
  - If componentDidMount or componentDidUpdate should be tested, use mount
  - If you want to test component lifecycle and children behavior, use mount
  - If you want to test children rendering with less overhead than mount
    and you are not interested in lifecycle methods, use render
*/

/*
  shallow is used for almost every use case.
  It ONLY renders the current element, such that if a child component
  causes an error, it won't fail the current unit under test
*/
describe('Shallow (Enzyme)', () => {
  it('renders ONLY the current element', () => {
    const wrapper = shallow(<ExampleOuter name="shallow" />)

    expect(wrapper).toMatchSnapshot()
  })
})

/*
  Mount is used when interactions with children are important
  for testing this component, and thus need to be rendered
  It is also needed in cases where a component uses interactions
  with it's lifecycle methods such as `componentDidMount`
*/
describe('Mount (Enzyme)', () => {
  it('renders all children, and can interact with lifecycle / synthetic events', () => {
    const wrapper = mount(<ExampleOuter name="mount" />)

    expect(wrapper).toMatchSnapshot()
  })
})

/*
  Render will output the static html displayed to the browser
  The wrapper created uses the Cheerio api:
  https://cheerio.js.org/#selectors
  You will not have access to lifecycle or events etc.
*/

describe('Render (Enzyme)', () => {
  it('renders the static html in a Cheerio wrapper', () => {
    const wrapper = render(<ExampleOuter name="render" />)

    expect(wrapper).toMatchSnapshot()
  })
})

// ------------------------------------
// API call testing / Mocking
// ------------------------------------
// Mock adapter api: https://github.com/ctimmerm/axios-mock-adapter

const getUsers = () => axios.get('/users')
  .then(response => response)

describe('Axios Mock Adapter', () => {
  const mock = new MockAdapter(axios)
  afterEach(() => { mock.reset() })

  it('successfully mocks an actual network request from happening', async () => {
    mock.onGet('/users').reply(200, {
      users: [
        { id: 1, name: 'Samuel Muthafuckin Jackson' },
      ],
    })

    const users = await getUsers()
    expect(users.data).toMatchObject({ users: [{ id: 1, name: 'Samuel Muthafuckin Jackson' }] })
  })

  it('mocks another request', async () => {
    mock.onGet('/users').reply(666, {
      errors: [
        { message: 'demons are invading' },
      ],
    })

    try {
      await getUsers()
    } catch (error) {
       expect(error.response.data).toMatchObject({ errors: [{ message: 'demons are invading' }] })
    }
  })
})
