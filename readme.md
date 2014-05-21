Codefluent
====
[Codefluent](http://github.com/gmccreight/codefluent) is an open source polyglot algorithm and data structure learning platform.  If you're impatient, check out [codefluent.us](http://www.codefluent.us), then come back here to read all about it.

Codefluent aims to have thousands of fully-worked, tested, and immediately runnable examples of algorithms and data structures in an exhaustive variety of languages.  It also aims to be ridiculously, even magically, easy to use in a classroom setting.  In short, it aims to be the first place developers think to go to learn a new language, algorithm, or data structure.

You can currently try data structures and algorithms in the following languages:

* C
* C++
* Clojure
* Coffeescript
* Haskell
* Javascript
* Python
* Ruby

We also have unfinished (but executable) code examples in:

* Lua
* Objective-C
* Go
* Scala

Usage
---

Codefluent can be used in several ways, which are outlined here.  We describe each usage in more detail later in the readme.

* Standard Usage
    * The website, [codefluent.us](http://www.codefluent.us), provides a try-in-the-browser interface.
* Contributor Usage
    * The "do\_everything\_from\_scratch" command will create an Ubuntu 14.04 Vagrant box and install everything you need to start contributing.

Rationale
---

Stack Overflow and Rosetta Code, for all their greatness, provide code snippets without context.  Often those snippets require a particular version of an interpreter and various tough-to-satisfy prerequisites.  Even if your setup is perfect, the code often contains small typos and logical errors that cause bugs because the code isn't automatically tested.  People who are learning a new language are the least well equipped to handle these often obtuse errors.

Tests are as important as code, and we treat them that way.  All code examples have tests.

Approach - Hosted Version
---

Unlike most learn-in-the-browser sites, we don't aim to provide an approximation of a single language in a REPL in the browser, rather we aim to provide real languages running real programs with real tests in the browser.  We do this by running the real programs in Docker containers.


Contributing
---

Codefluent aims to be very easy to contribute to.  It relies very heavily on modularity and conventions.  If you follow the conventions your code and its unit tests will just work.

Meta-harness
---

Many test harnesses use different reporting formats.  Codefluent gets around this problem by using custom regex matchers for each reporting format, allowing us to create a meta-harness that helps us ensure that all the tests for all the code examples pass.  Having such a harness in place allows us to release new versions of the full stack quickly and without fear of regressions.  It will also allow us to vet new contributions quickly.
