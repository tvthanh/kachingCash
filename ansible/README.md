# Automate deploy and new severs setup.

For automation deploy and setup process we are using [Ansible](https://www.ansible.com/)
For installation details check [Ansible installation doc](http://docs.ansible.com/ansible/intro_installation.html)

## Environments
Three environments are set up:
 * develop
 + staging
 - production

To run an ansible script on any of that environments you need to use ansible-playbook command with --inventory-file (-i) option eg.
> ansible-playbook -i ansible/develop ansible/kaching.yml
That command will not do anything. To do setup or deploy you need to use --extra-vars option
To create whole environment call
> ansible-playbook -i ansible/develop ansible/kaching.yml --extra-vars="setup=true"
To deploy new code call
> ansible-playbook -i ansible/develop ansible/kaching.yml --extra-vars="deploy=true" --ask-vault-pass --private-key=/Users/thuanle/Ulab/kaching.pem
Deploy is subset of setup.

The most sensitive variables are encrypted using [ansible vault](http://docs.ansible.com/ansible/playbooks_vault.html).
You have to add option --ask-vault-pass=PASSWORD. Ask your collegues for password.

## Summary
To run setup call:
> ansible-playbook -i ansible/INVENTORY ansible/kaching.yml --extra-vars="setup=true" --ask-vault-pass
To run deploy call:
> ansible-playbook -i ansible/INVENTORY ansible/kaching.yml --extra-vars="deploy=true" --ask-vault-pass

## Bitbucket private key
Because of kaching-frontend repository is private repo stored on Bitbucket you need to provide a private key related
with a SSH key set for your Bitbucket account. This file you should put on ansible/roles/wordpress/files/ directory as a 'key'.
This file has it's role on .gitignore file and should never be uploaded.
