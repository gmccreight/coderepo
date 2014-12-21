### Developing

    ./run_nanoc_view.sh

In another terminal tab, you can do (or look into a guard version, which is better):

    while (true); do nanoc; sleep 1; done

If the code templates have been updated, you'll need to load them using:

    ./update_code_templates.rb

### Deploying to S3

If you have the untracked\_aws\_info file containing the secrets required to
deploy to S3, you can deploy using:

    ./coderepo_deploy.sh

### How data is stored

TODO... fill in more info

codedata.coderepo.io is an S3 bucket with CORS capabilities.

    <CORSConfiguration>
     <CORSRule>
       <AllowedOrigin>http://www.coderepo.io</AllowedOrigin>
       <AllowedMethod>POST</AllowedMethod>
       <AllowedHeader>*</AllowedHeader>
     </CORSRule>
     <CORSRule>
       <AllowedOrigin>*</AllowedOrigin>
       <AllowedMethod>GET</AllowedMethod>
     </CORSRule>
    </CORSConfiguration>
