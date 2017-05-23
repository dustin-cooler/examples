<?php
/* Class StringPermutations
 * generate all unique permutations of a given string
 * param string: (String) initial string
 */
class StringPermutations {
  private $string = '';

  // array of character positions
  private $indices = array();

  // array of integers indicating which direction to shift each character position
  private $directions = array();

  // array of unique permutations
  private $permutations = array();

  private $length = 0;

  // initial set up
  public function __construct($string) {
    $this->permutations[] = $string;
    $this->string = $string;
    $this->length = strlen($this->string);

    // populate the indices and directions arrays with initial values
    $this->indices[] = 0;
    $this->directions[] = 0;
    for ($i = 1; $i < $this->length; $i++) {
      $this->indices[] = $i;
      $this->directions[] = -1;
    }
  }

  // generate and return the permutations
  public function getPermutations() {
    $this->permute();
    return $this->permutations;
  }

  // swaps character indexes and directions
  private function swap($a, $b) {
    $tempIndex = $this->indices[$a];
    $this->indices[$a] = $this->indices[$b];
    $this->indices[$b] = $tempIndex;

    $tempDirection = $this->directions[$a];
    $this->directions[$a] = $this->directions[$b];
    $this->directions[$b] = $tempDirection;
  }

  // builds the final string from a single run's permutation of character positions
  private function buildString() {
    $characters = '';
    for ($i = 0; $i < $this->length; $i++) {
      $characters .= $this->string[$this->indices[$i]];
    }
    return $characters;
  }

  // recursively generate each permutation
  private function permute() {
    $maxIndex = null;
    // find the rightmost character that hasn't been moved through all positions yet
    for ($i = 0; $i < $this->length; $i++) {
      if (
        $this->directions[$i] !== 0 &&
        ($maxIndex === null || $this->indices[$i] > $this->indices[$maxIndex])
      ) {
        $maxIndex = $i;
      }
    }

    // if there are no more characters to swap, we're done, so return the final array of permutations
    if ($maxIndex === null) {
      var_dump($this->permutations);
      return $this->permutations;
    }

    // do the swap, shifting the character at $maxIndex one position left or right
    $moveTo = $maxIndex + $this->directions[$maxIndex];
    $this->swap($maxIndex, $moveTo);

    if (
      $moveTo === 0 || // if the character has moved to the first position
      $moveTo === $this->length - 1 || // or the last position
      $this->indices[$moveTo + $this->directions[$moveTo]] > $this->indices[$moveTo] // or the character in the next position is in its final position
    ) {
      $this->directions[$moveTo] = 0; // don't move this character anymore
    }

    // update the directions array for the next permutation
    for ($i = 0; $i < $this->length; $i++) {
      if ($this->indices[$i] > $this->indices[$moveTo]) {
        if ($i < $moveTo) {
          $this->directions[$i] = 1;
        } else {
          $this->directions[$i] = -1;
        }
      }
    }

    // save the resulting string to the permutations array, make sure the permutations array
    // contains only unique values, and re-run the permute function to get the next result
    $this->permutations[] = $this->buildString();
    $this->permutations = array_unique($this->permutations);
    $this->permute();
  }
}

/* Example usage - print all the possible permutations of a tic tac toe board
 * Assumptions: 9 total turns, X always goes first, X gets 3-5 turns, O gets
 * either the same or one fewer turns as X, _ represents empty boxes
 */

for ($i = 3; $i < 6; $i++) {
  // O gets one fewer turn than X (5, 7, or 9 total turns)
  $Xs = str_pad('', $i, 'X');
  $Os = str_pad('', $i - 1, 'O');
  $string = str_pad($Xs . $Os, 9, '_');
  $permuter = new StringPermutations($string);
  $permutations = $permuter->getPermutations();
  foreach ($permutations as $value) {
    print_results($value);
  }

  // O and X get equal turns (6 or 8 total turns)
  $Xs = str_pad('', $i, 'X');
  $Os = str_pad('', $i, 'O');
  $string = str_pad($Xs . $Os, 9, '_');
  $permuter = new StringPermutations($string);
  $permutations = $permuter->getPermutations();
  foreach ($permutations as $value) {
    print_results($value);
  }
}

function print_results($string) {
  echo substr($string, 0, 3) . "\n";
  echo substr($string, 3, 3) . "\n";
  echo substr($string, 6, 3) . "\n";
  echo "===\n";
}

?>
