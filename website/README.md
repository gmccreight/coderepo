### Developing

    ./run_nanoc.sh

In another terminal tab, you can do (or look into a guard version, which is better):

    for i in {1..10000}; do nanoc; sleep 1; done

If the code templates have been updated, you'll need to load them using:

    ./update_code_templates.rb

### Deploying to S3

If you have the untracked\_aws\_info file containing the secrets required to
deploy to S3, you can deploy using:

    ./codefluent_deploy.sh
