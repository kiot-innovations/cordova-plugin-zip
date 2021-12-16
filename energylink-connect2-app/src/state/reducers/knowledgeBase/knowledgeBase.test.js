import knowledgeBaseReducer from '.'

import * as knowledgeBaseActions from 'state/actions/knowledgeBase'

describe('Language reducer', () => {
  const reducerTest = reducerTester(knowledgeBaseReducer)

  it('returns the initial state', () => {
    reducerTest({ currentTutorial: {} }, {}, { currentTutorial: {} })
  })

  it('changes currentTutorial when SET_TUTORIAL action is fired', () => {
    reducerTest(
      { currentTutorial: {} },
      knowledgeBaseActions.SET_TUTORIAL({
        title: 'How to install solar panels',
        video: 'https://www.youtube.com/embed/rghwZ637Rxs'
      }),
      {
        currentTutorial: {
          title: 'How to install solar panels',
          video: 'https://www.youtube.com/embed/rghwZ637Rxs'
        }
      }
    )
  })

  it('resets the currentTutorial when RESET_TUTORIAL action is fired', () => {
    reducerTest(
      {
        currentTutorial: {
          title: 'How to install solar panels',
          video: 'https://www.youtube.com/embed/rghwZ637Rxs'
        }
      },

      knowledgeBaseActions.RESET_TUTORIAL(),
      { currentTutorial: {} }
    )
  })
})
