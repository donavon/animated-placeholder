import { useState, useEffect } from 'react';
import useInstance from '@use-it/instance';

export const usePlaceholder = (placeholders, config = {}) => {
  const {
    iterationCount = Infinity,
    // average typing speed is 40 wpm
    // avg english word size is 4.7 chars/word (+ space)
    // so… avg chars/min is 228, avg chars/sec is 3.8 or 263 msecs/character
    typingSpeed = 263,
    typingVariation = 75,
    // the default macOS repeat rate is 60 msecs
    backspaceSpeed = 60,
    // the default macOS cursor flash rate is 500 msecs
    cursorFlashRate = 500,
    displayCursor = true,
    delayBetweenPhrases = 2000,
    cursorCharacter = '|',
    prefixString = '',
    staticText = '',
    initialDelay = 0,
  } = config;
  const self = useInstance({
    typing: false,
    placeholdersIndex: 0,
    placeholderIndex: 0,
    direction: 1,
    iterationRemaining: iterationCount,
  });
  const [placeholder, setPlaceholder] = useState('');
  const [showCursor, setShowCursor] = useState(displayCursor);

  // flashing cursor
  useEffect(() => {
    if (placeholders && self.iterationRemaining && displayCursor) {
      setShowCursor(true);
      self.cursorTimer = setInterval(() => {
        setShowCursor((s) => !s);
      }, cursorFlashRate);
    }
    return () => {
      clearInterval(self.cursorTimer);
    };
  }, [cursorFlashRate, displayCursor, placeholders, self]);

  // typing timer
  useEffect(() => {
    const startTyping = (timeout) => {
      // eslint-disable-next-line no-use-before-define
      self.typingTimer = setTimeout(type, timeout);
    };

    const type = () => {
      self.typing = true;
      // eslint-disable-next-line no-shadow
      const placeholder = placeholders[self.placeholdersIndex];
      const partialPlaceholder = placeholder.substr(0, self.placeholderIndex);
      self.placeholderIndex += self.direction;
      setPlaceholder(partialPlaceholder);

      // at end of line?
      if (self.direction === 1 && self.placeholderIndex > placeholder.length) {
        self.direction = -1;
        startTyping(delayBetweenPhrases);
        return;
      }
      // backspaced to the beining of the line?
      if (self.direction === -1 && self.placeholderIndex === -1) {
        self.direction = 1;
        self.placeholderIndex = 0;
        self.placeholdersIndex += 1; // next placeholder in array
        if (self.placeholdersIndex === placeholders.length) {
          self.placeholdersIndex = 0;
          self.iterationRemaining -= 1;
          if (self.iterationRemaining === 0) {
            self.typing = false;
            return;
          }
        }
        startTyping(delayBetweenPhrases);
        return;
      }

      const randomTypingSpeed =
        self.direction === 1
          ? typingSpeed -
            typingVariation +
            Math.floor(Math.random() * typingVariation)
          : backspaceSpeed;
      startTyping(randomTypingSpeed);
    };

    // after initial delay show the prefix and cursor and wait delayBetweenPhrases
    // then start typing
    if (placeholders && self.iterationRemaining) {
      self.typingTimer = setTimeout(() => {
        self.typing = true;
        startTyping(delayBetweenPhrases);
      }, initialDelay);
    }
    return () => {
      clearTimeout(self.typingTimer);
    };
  }, [
    self,
    placeholders,
    displayCursor,
    typingSpeed,
    typingVariation,
    delayBetweenPhrases,
    initialDelay,
    backspaceSpeed,
  ]);

  const cursor = showCursor ? cursorCharacter : '';
  return placeholders && self.typing
    ? `${prefixString}${placeholder}${cursor}`
    : staticText;
};
