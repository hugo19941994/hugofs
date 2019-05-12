workflow "Deploy" {
  resolves = [
    "Run deploy script",
  ]
  on = "push"
}

action "Run deploy script" {
  needs = "Master"
  uses = "maddox/actions/ssh@master"
  args = "cd /srv/hugofs && git pull && npm install && sudo /bin/systemctl restart hugofs.service && sudo /bin/systemctl restart hugofsback.service"
  secrets = [
    "PRIVATE_KEY",
    "PUBLIC_KEY",
    "HOST",
    "USER",
  ]
}

action "Master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}
