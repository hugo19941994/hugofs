## CAA

This record restricts which authorities can generate a certificate for your domain.

```
hugofs.com. 3600 CAA 0 iodef"mailto:me@hugofs.com"
hugofs.com. 3600 CAA 0 issue "letsencrypt.org"
```

## SSHFP

You can publish your public SSH keys' fingerprint using DNS and automatically accept them on first connection.

To generate the recordsyou can use the following command:

```sh
ssh-keygen -r hugofs.com
hugofs.com IN SSHFP 1 1 af8b08458b68cef7b06aee20cc554ef82ab129ed
hugofs.com IN SSHFP 1 2 c12fdd4ec53dd7776d8f2e467b8ba84924b2ab17f63b49e6e7f0e3239affa0d3
hugofs.com IN SSHFP 2 1 3a0dd8c01e4565915e8b307f79a0258b167426f0
hugofs.com IN SSHFP 2 2 449b1e423c4f7eae269e24774eab40883549d7292f083657b9c6a0a884e95d14
hugofs.com IN SSHFP 3 1 35f491d8cbe6c1966a03127e5946b963fb7f9a08
hugofs.com IN SSHFP 3 2 ff02dd610811ef9c58f2bf9d97d071d528def82eecfcc032f88f631929ec7e07
hugofs.com IN SSHFP 4 1 fc35d2d6dc1684a8254ad31bb04a0bdc879e5994
hugofs.com IN SSHFP 4 2 b99391dc194e1ebd70cbf0f247147b7a06b41f733392bf3f64cd77ce6da39e75
```

```
hugofs.com. 3600 SSHFP 1 2 C12FDD4EC53DD7776D8F2E467B8BA84924B2AB17F63B49E6E7F0E3239AFFA0D3
hugofs.com. 3600 SSHFP42B99391DC194E1EBD70CBF0F247147B7A06B41F733392BF3F64CD77CE6DA39E75
```

In your ssh config:

To automatically accept keys when the DNS record matches add the following to your OpenSSH client configuration file (usually `./.ssh/conifg`). Of course your can change the host to whichever domain you want.

```
Host *
    VerifyHostKeyDNS yes
```

Instead of `yes` you can use `ask` which will tell you if its valid or not but it won't accept it automatically.

## DNSSEC

I used to use BIND9 as my DNS server, and managing DNSSEC was a pain. I recently switched to [Knot](https://www.knot-dns.cz/) and it makes this a breeze. It's all handled automatically.

To enable automatic DNSSEC zone signing just add the following lines to knot.conf:

```
zone:
  - domain: example.com
    dnssec-signing: on
    dnssec-policy: default
```

After reloading the zone Knot will generate a ZSK and KSK key pair which you can then add to your registrar. The public keys can be checked

To prevent zone enumarations you can enable NSEC3 very easily. Specify a non default DNSSEC policy with nsec3 enabled:

```
policy:
  - id: custompolicy
    nsec3: true

zone:
 - domain: example.com
   dnssec-signing: on
   dnssec-policy: custompolicy
```

## TLSA

TLSA is a bit more complicated, but if you use [Lets Encrypt](https://letsencrypt.org/) with [certbot](https://certbot.eff.org/) you can generate the TLSA records automatically upon renewal


## Publish PGP keys using DANE

There are several ways to publish PGP keys, but the most recent one relies on DANE.
Depending on your PGP's key size the record can get pretty big
