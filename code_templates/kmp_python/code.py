# File: code.py
# Author: Keith Schwarz (htiek@cs.stanford.edu)
#
# An implementation of the Knuth-Morris-Pratt (KMP) string-matching algorithm.
# This algorithm takes as input a pattern string P and target string T, then
# finds the first occurrence of the string T in the pattern P, doing so in time
# O(|P| + |T|).  The logic behind the algorithm is not particularly complex,
# though getting it to run in linear time requires a few non-obvious tricks.
#
# To motivate KMP, consider the naive algorithm for trying to match a pattern
# string P against a target T.  This would work by considering all possible
# start positions for the pattern P in the target T, then checking whether a
# match exists at each of those positions.  For example, to match the string
# ABC against the target string ABABABACCABC, we'd get
#
#     ABABABACCABC
#     ABX               (first two characters match, last does not)
#      X                (first character doesn't match)
#       ABX             (first two characters match, last does not)
#        X              (first character doesn't match)
#         ABX           (first two characters match, last does not)
#          X            (first character doesn't match)
#           AX          (first character matches, second doesn't)
#            X          (first character doesn't match)
#             X         (first character doesn't match)
#              ABC      (match found)
#
# This algorithm runs in O(mn) in the worst case, where m = |T| and n = |P|,
# because it has to do O(n) work to check whether the string matches O(m) times
# for each spot in the string.
#
# However, a lot of this is wasted work.  For example, in the above example,
# consider what happens when we know that the string ABC does not match the
# first part of the string, ABA.  At this point, it would be silly to actually
# try to match the string at the string starting with the B, since there's no
# possible way that the string could match there.  Instead, it would make more
# sense to instead start over and try matching ABC at the next A.  In fact,
# more generally, if we can use the information we have about what characters
# we already matched to determine where we should try to resume the search in
# the string, we can avoid revisiting characters multiple times when there's no
# hope that they could ever match.
#
# The idea we'll use is to look for "borders" of a string, which are substrings
# that are both a prefix and suffix of the string.  For example, the string
# "aabcaa" has "aa" as a border, while the string "abc" just has the empty
# string as a border.  Borders are useful in KMP because they encode
# information about where we might need to pick up the search when a particular
# match attempt fails.  For example, suppose that we want to match ABABC
# against the string ABABABC.  If we start off by trying to match the string,
# we'll find that they overlap like this:
#
#    ABABABC
#    ABABx
#
# That is, the first four characters match, but the fifth does not.  At this
# point, rather than naively restarting the search at the second character (B),
# or even restarting it at the third position (A), we can instead note that we
# can treat the last two characters of the string we matched (AB) as the first
# two characters of the pattern string ABABC if we just treated it instead as
# though we had
#
#    ABABABC
#    ABABx
#      ABABC
#
# If we can somehow remember the fact that we already matched the AB at the
# start of this string, we could just confirm that the three characters after
# it are ABC and be done.  There's no need to confirm that the characters at
# the front match.
#
# In order to make this possible, we'll construct a special data structure
# called the "fail table."  This table stores, for each possible prefix of the
# string to match, the length of the longest border of that prefix.  That way,
# when we find a mismatch, we know where the next possible start location could
# be found.  In particular, once we have a mismatch, if there's any border of
# the prefix of the pattern that we matched so far, then we can treat the end
# of that matching prefix as the start of a prefix of the word that occurs
# later in the target.
#
# The basic idea behind KMP is, given this table, to execute the following:
#
#  - Guess that the string starts at the beginning of the target.
#  - Match as much of the string as possible.
#  - If the whole string matched, we're done.
#  - Otherwise, a mismatch was found.  Look up the largest border of the
#    string that was matched so far in the failure table.  Suppose it has
#    length k.
#  - Update our guess of the start position to be where that border occurs
#    in the portion matched so far, then repeat this process.
#
# Notice that once we've matched a character against part of the pattern (or
# found that it can't possibly match), we never visit that character again.
# This is responsible for the fast runtime of the algorithm (though I'll give a
# more formal description later on).

# Function: failTable(pattern)
# Usage: failTable("This is a string!")
# -----------------------------------------------------------------------------
# Given a string, constructs the KMP failure table for that string.  The values
# in the table are defined as
#
#    table[i] = |LongestProperBoundary(pattern[0:i)])|
#
# Where the longest proper boundary of a string is the longest proper substring
# of that string that is both a prefix and a suffix.  For example, given the
# string "abcabc," the longest proper boundary is abc.  Similarly, given the
# string "apple," the longest proper boundary is the empty string.
#
# As a sample output of this function, given the string "ababcac", the table
# would be
#
#     a b a b c a c
#    * 0 0 1 2 0 1 0
#
# This means, for example, that the longest proper boundary of the prefix "aba"
# has length 1, while the longest proper boundary of the string as a whole is
# the empty string.  Notice that the first entry is *, which we have chosen
# because there is no mathematically well-defined proper substring of the empty
# string.  We can put anything we want there, and we'll go with None.
#
# To compute the values of this table, we use a dynamic programming algorithm
# to compute a slightly stronger version of the function.  We define the
# function "Extended Longest Proper Boundary" (xLPB) as follows:
#
#    xLPB(string, n, char) = The longest proper boundary of string[0:n] + char
#
# The idea behind this function is that we want to be able to recycle the
# values of the longest proper boundary function for smaller prefixes of the
# string in order to compute the longest proper boundary for longer prefixes.
# To make this easier, the xLPB function allows us to talk about what would
# happen if we extended the longest proper boundary of some prefix of the
# string by a single character.  Notice that for any nonzero n, we have that
#
#   LongestProperBoundary(string[0:n]) = xLPB(string, n - 1, string[n])
#
# That is, we simply tear off the last character and use it as the final
# argument to xLPB.  Given this xLPB function, we can compute its values
# recursively using the following logic.  As a base case, xLPB(string, 0, char)
# is the longest proper boundary of string[0:0] + char = char.  But this has
# only one proper boundary, the empty string, and so its value must be zero.
#
# Now suppose that for all n' < n we have the value of xLPB(string, n', char)
# for any character char.  Suppose we want to go and compute
# xLPB(string, n, char).  Let's think about what this would mean.  Given that
# n is not zero, we can think of this problem as trying to find the longest
# proper boundary of this string:
#
#     +------------+---+------------+------------+---+
#     |     LPB    | ? |    ...     |     LPB    | c |
#     +------------+---+------------+------------+---+
#
#     ^                                          ^ ^
#     +----------------------+-------------------+ |
#                            |                     |
#                   String of length n      New character
#
# The idea is that we have the original string of length n, followed by our new
# character char (which we'll abbreviate c).  In this diagram, I've marked the
# LPB of the string of length n.  Notice that right after the LPB at the prefix
# of the string, we have some character whose value is unknown (since n != 0
# and the LPB can't be the whole string).  If this value is equal to c, then
# the LPB of the whole string can be formed by simply extending the LPB of the
# first n characters.  There can't be a longer proper boundary, since otherwise
# we could show that by taking that longer boundary and dropping off the
# character c, we'd end up with a longer proper boundary for the first n
# characters of the string, contradicting that we chose the longest proper
# boundary.
#
# By our above argument, remember that the length of the longest proper
# boundary of the first n characters of the string is given by
#
#    xLPB(string, n - 1, string[n - 1])
#
# Thus we have the first part of our recurrence, which is defined as
#
#    xLPB(string, n, char) =
#        if n = 0, then 0.
#        let k = xLPB(string, n - 1, string[n - 1])
#        if string[k] == char, return k + 1
#        else, ???
#
# Now, suppose that we find that the character after the LPB does not match.
# If this happens, we can then make the following observation.  Below I've
# reprinted the above diagram:
#
#     +------------+---+------------+------------+---+
#     |     LPB    | ? |    ...     |     LPB    | c |
#     +------------+---+------------+------------+---+
#
#     ^                                          ^ ^
#     +----------------------+-------------------+ |
#                            |                     |
#                   String of length n      New character
#
# Notice that any LPB of this new string must be a prefix of the LPB of the
# first n characters and a suffix of the LPB followed by the character c.
# Since by definition the LPB of the first n characters must be a prefix of
# those n characters, we have the following elegant conclusion to our
# recurrence:
#
#    xLPB(string, n, char) =
#        if n = 0, then 0.
#        let k = xLPB(string, n - 1, string[n - 1])
#        if string[k] == char, return k + 1
#        else, xLPB(string, k, char)
#
# The reason for this is that xLPB(string, k, char) asks for the longest
# proper boundary of the LPB of the string formed from the first n characters
# of the string followed by the character c, which is exactly what we described
# above.
#
# As written, filling in the table of LPB values would take O(n^2) time, where
# n is the length of the string.  However, using dynamic programming and an
# amortized analysis, we can show that this function can be made to run in
# O(n) time.  In particular, suppose that for all n' < n, we know the value of
# LPB(string[0:n]).  Then in the above formulation of xLPB, the first
# recursive call is known, and the only recursive call we may actually need to
# make is the second.
#
# However, this doesn't seem to say anything about the runtime of the second
# recursive call, which seems as though it might cause the evaluation of this
# function to run in time O(n).  This is correct, but in an *amortized* sense
# the whole table can still be computed in O(n) time overall.  To see this,
# let's define a potential function Phi(k) that associates a potential at each
# point of the computation of the table.  In particular, define Phi(k) as
#
#   Phi(0)     = 0
#   Phi(k + 1) = result[k - 1]
#
# Here, result is the resulting table of LPB values.  Because of this, we can
# remark that result[k] < k, since the longest proper border of a string can't
# be any longer than that string.
#
# Let's now show that this potential function gives an amortized O(1) cost for
# each table entry computation, and thus an O(n) overall runtime for the table-
# building algorithm.  To see this, consider what happens when the logic to
# compute the next value runs.  The runtime for this step is bounded by the
# number of recursive calls made to a subproblem.  However, each subproblem is
# then of size given by the LPB of a slightly smaller problem.  This subproblem
# must then have size at most the size of that smaller subproblem.  In other
# words, we can say that each recursive call drops the maximum possible value
# of the LPB for the current prefix by at least one.  Consequently, if k
# recursive calls are made, the LPB of the current prefix is at least k smaller
# than the LPB of the previous prefix, and so
#
#   D Phi = -k
#
# And so the amortized cost of computing the next term is 1 + k - k = O(1).

match_index_instrument = [] #cfinstrument
fail_instrument = [] #cfinstrument

def failTable(pattern):
    # Create the resulting table, which for length zero is None.
    result = [None]

    # Iterate across the rest of the characters, filling in the values for the
    # rest of the table.
    for i in range(0, len(pattern)):
        # Keep track of the size of the subproblem we're dealing with, which
        # starts off using the first i characters of the string.
        j = i

        while True:
            # If j hits zero, the recursion says that the resulting value is
            # zero since we're looking for the LPB of a single-character
            # string.
            if j == 0:
                result.append(0)
                break

            # Otherwise, if the character one step after the LPB matches the
            # next character in the sequence, then we can extend the LPB by one
            # character to get an LPB for the whole sequence.
            if pattern[result[j]] == pattern[i]:
                result.append(result[j] + 1)
                break

            # Finally, if neither of these hold, then we need to reduce the
            # subproblem to the LPB of the LPB.
            j = result[j]
    
    return result

# Function: kmpMatch(needle, haystack)
# Usage: print kmpMatch("0101", "0011001011") # Prints 5
# -----------------------------------------------------------------------------
# Uses the KMP algorithm to find an occurrence of the specified needle string
# in the haystack string.  To do this, we compute the failure table, which
# is done above.  Next, we iterate across the string, keeping track of a
# candidate start point and length matched so far.  Whenever a match occurs, we
# update the length of the match we've made.  On a failure, we update these
# values by trying to preserve the maximum proper border of the string we were
# able to manage by that point.
def kmpMatch(needle, haystack):
    del match_index_instrument[ 0:len(match_index_instrument) ] #cfinstrument
    del fail_instrument[ 0:len(fail_instrument) ]               #cfinstrument

    # Compute the failure table for the needle we're looking up.
    fail = failTable(needle)

    # Keep track of the start index and next match position, both of which
    # start at zero since our candidate match is at the beginning and is trying
    # to match the first character.
    index = 0
    match = 0

    # Loop until we fall off the string or match.
    while index + match < len(haystack):

        # If the current character matches the expected character, then bump up
        # the match index.
        if haystack[index + match] == needle[match]:
            match_index_instrument.append([index, match]) #cfinstrument
            match = match + 1

            # If we completely matched everything, we're done.
            if match == len(needle):
                return index

        # Otherwise, we need to look at the fail table to determine what to do
        # next.
        else:
            # If we couldn't match the first character, then just advance the
            # start index.  We need to try again.
            if match == 0:
                index = index + 1

            # Otherwise, see how much we need to skip forward before we have
            # another feasible match.
            else:
                fail_instrument.append([index, match]) #cfinstrument
                index = index + match - fail[match]
                match = fail[match]
                fail_instrument.append([index, match]) #cfinstrument

    # If we made it here, then no match was found.
    return None

#cffileid:37
