const moveCaret = (e) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(e);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  e.focus();
};

export default moveCaret;
