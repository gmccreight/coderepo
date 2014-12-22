### Runner Containers

#### How to upgrade a runner container

You have a runner container, c\_check\_0\_9\_13 and you want to upgrade
it to version 0\_9\_14.

First, rename the runner container directory, then find any Runner files that
referenced the old directory, and rename the runner container within them.

Inside the runner container directory, change the installer to update the
version of the c\_check framework, then run:

    cd runner; ./docker_build c_check_0_9_14

Since most of the steps in the Dockerfile prior to the installer step remain
the same as before, it should quickly use the cached steps, then re-run the
installer.
