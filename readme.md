Coderepo
====
[Coderepo](http://github.com/gmccreight/coderepo) is an open source
polyglot algorithm and data structure code repository.  If you're impatient,
check out [coderepo.io](http://www.coderepo.io).

Coderepo aims to have thousands of fully-worked, tested, and immediately
runnable code modules in an exhaustive variety of languages.  

We currently have code in the following languages:

* C
* C++
* Clojure
* Coffeescript
* Haskell
* Javascript
* Python
* Ruby
* Rust

Usage
---

Coderepo can be used in several ways, which are outlined here.  We describe
each usage in more detail later in the readme.

* Standard Usage
    * The website, [coderepo.io](http://www.coderepo.io), provides a
      try-in-the-browser interface.
* Contributor Usage
    * The "do\_everything\_from\_scratch" command will create an Ubuntu 14.04
      Vagrant box and install everything you need to start contributing.

Rationale
---

Stack Overflow and Rosetta Code are both amazing, but they often provide code
snippets without context.  Those snippets require an implied version of
an interpreter and various tough-to-satisfy prerequisites.  Even if your setup
is perfect, the code often contains small typos and logical errors that cause
bugs because the code isn't automatically tested.

Having tests for the code has several advantages:  First, the tests act as a
client of the code, ensuring that it works.  Secondly, the tests can
demonstrate to the audience how the code is intended to work, acting as a
specification.  Finally, the tests serve as an example of how testing can
be done in the language.

Approach - Hosted Version
---

Unlike most learn-in-the-browser sites, we don't aim to provide an
approximation of languages in a REPL in the browser, rather we aim to
provide real languages running real programs with real tests in the browser.
We accomplish this by running the real programs in Docker containers.


Contributing
---

Coderepo aims to be very easy to contribute to.

Contributing - Setup
---
There are only two prerequisites, Virtualbox and Vagrant.

Once you have those installed, you can run:

    ./do_everything_from_scratch

It will download an Ubuntu 14.04 base box, install all the software, then run
the tests.

Contributing - Adding a runner container
---

In `runner/runner_containers`, add a directory consisting of a Dockerfile,
installer, and runner.  See any of the existing runner containers as examples.

Let's say you add the following runner container: elixer\_1\_0\_0

To build it

    cd runner; ./docker_build elixer_1_0_0

Contributing - Adding a shared code template
---

If you just want to add a shared code template that runs in one of the
pre-existing runner containers, you can just copy one of the directories in
the shared\_code\_templates directory and make changes to it.

For example, you could

    cd shared_code_templates; cp -a kmp_in_python stack_in_python

Then you could make some changes in stack\_in\_python and run it with:

    cd runner/build_and_run; ./run_one stack_in_python

If you want to use your newly created runner container, though, you'll need to
understand the directory structure a bit more.

In `shared_code_templates` add a directory consisting of all the files you
would like to be able to run in the runner container, and also a `Runner` file
which specifies the name of the runner to use.  In this case, let's make
a shared code template called binary\_tree\_in\_elixer.  The `Runner` file
consists of elixer\_1\_0\_0

Once you've done that, you can run the code in the container with the following
command:

    cd runner/build_and_run; ./run_one binary_tree_in_elixer

Meta-harness
---

Many test harnesses use different reporting formats.  Coderepo gets around
this problem by using custom regex matchers for each reporting format, allowing
us to create a meta-harness that helps us ensure that all the tests for all the
code examples pass.  Having such a harness in place allows us to release new
versions of the full stack quickly and without fear of regressions.
