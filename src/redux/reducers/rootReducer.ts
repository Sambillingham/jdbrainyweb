import { combineReducers, AnyAction, Reducer } from 'redux';

import IQuizState, { initialQuizState } from '../state/quizState';
import IStoryState, { initialStoryState } from '../state/storyState';
import IWordState, { initialWordState } from '../state/wordState';
import IRootState from '../state/rootState';

import keys from '../actions/keys';

const storyReducer: Reducer<IStoryState, AnyAction> = (
  state = initialStoryState,
  action
): IStoryState => {
  switch (action.type) {
    case keys.SELECT_STORY_SUCCESS:
      const { id } = action;
      let newCurrStory = state.stories.find(story => story.id === id);

      if (!newCurrStory) return { ...state };

      return {
        ...state,
        currStory: newCurrStory
      }
    case keys.MASTER_WORD_SUCCESS:
      const { word, storyId } = action;

      const storyIdx = state.stories.findIndex(story => story.id === storyId);
      const updatedStory = { ...state.stories[storyIdx] };

      if (!updatedStory) return { ...state };

      const updatedSection = { ...updatedStory.sections[updatedStory.currSectionIdx] };
      updatedSection.word = word;

      const updatedSections = [...updatedStory.sections];
      updatedSections[updatedStory.currSectionIdx] = updatedSection;

      updatedStory.sections = updatedSections;
      updatedStory.currSectionIdx += 1;

      // TODO: fix this
      if (updatedStory.currSectionIdx + 1 > updatedStory.sections.length) {
        console.log('fuck');
      }
  
      const updatedStories = [...state.stories];
      updatedStories.splice(storyIdx, 1, updatedStory)

      console.log(updatedStory);
      console.log(updatedStories);
      return {
        ...state,
        stories: updatedStories,
        currStory: updatedStory,
      }
    default:
      return state
  }
}

const wordReducer: Reducer<IWordState, AnyAction> = (
  state = initialWordState,
  action
): IWordState => {
  switch (action.type) {
    case keys.MASTER_WORD_SUCCESS:
      const { word } = action;
      word.complete = true;

      const idxToUpdate = state.words.findIndex(word => word.text === action.word.text);

      if (idxToUpdate < 0) return { ...state };

      const newWords = [...state.words];
      newWords[idxToUpdate] = word;

      return {
        ...state,
        words: newWords
      }
    default:
      return state
  }
}

const quizReducer: Reducer<IQuizState, AnyAction> = (
  state = initialQuizState,
  action
): IQuizState => {
  switch (action.type) {
    case keys.SELECT_QUIZ_WORD_SUCCESS:
      const { word } = action;
      return {
        ...state,
        word,
      };
    default:
      return state
  }
}

const rootReducer = combineReducers<IRootState>({
  storyState: storyReducer,
  wordState: wordReducer,
  quizState: quizReducer,
});

export default rootReducer;