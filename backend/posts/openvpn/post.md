![OpenVPN ascii art](/assets/blog/OpenVPN.png)

# Intro

[OpenVPN](https://openvpn.net/index.php/open-source.html) is an open source VPN solution that works on a tonne of platforms. However, the default configuration is somewhat outdated. Some of these tips only work with OpenVPN 2.3+

# Use Easy-RSA3

OpenVPN usually ships with Easy-RSA2\. But today (03/09/2015) [Easy-RSA3](https://github.com/OpenVPN/easy-rsa/releases) has been oficially released. I've used the release candidate since 2014 and it has never failed me. With the oficial release you now have no excuse to migrate your PKI.

I find the third version quite a bit easier to use and manage. The vars file now has sane defaults, they added a simpler distinguished name scheme where you only need to enter a common name and removed the deprecated Netscape Cert Attribute.

# Key sizes

## x509 Key size

When generating your CA, server and client certificates set _at least_ 2048 bit key lengths. 1024 bit keys are no longer deemed secure. 2048 bits are secure for years to come, but if you are paranoid 4096 bit keys are also common. However, CPU usage, key generation time and TLS handshakes will take longer.

To increase the key sizes you must edit your vars file within easyrsa.

## DH parameters length

2048 bits is considered secure, but you might want to generate a 4096 one. Generating these parameters takes quite a while, depending on the machine, and the amount of time only increases as the size of the key goes up.

# Hardening the control channel

## TLS-Cipher

On your server conf file choose modern ciphers. These include:

* `TLS-DHE-RSA-WITH-AES-256-GCM-SHA384`
* `TLS-DHE-RSA-WITH-AES-256-CBC-SHA256`
* `TLS-DHE-RSA-WITH-AES-128-GCM-SHA256`
* `TLS-DHE-RSA-WITH-AES-128-CBC-SHA256`

If you _need_ compatibility with older OpenVPN version you can add any of these:

* `TLS-DHE-RSA-WITH-AES-256-CBC-SHA`
* `TLS-DHE-RSA-WITH-CAMELLIA-256-CBC-SHA`
* `TLS-DHE-RSA-WITH-AES-128-CBC-SHA`
* `TLS-DHE-RSA-WITH-CAMELLIA-128-CBC-SHA`

The 128 bit key size ciphers should be secure for a long time. However, depending on your level of paranoia, you might want to only enable the 256 bit key size ciphers.

## TLS version

If you want, you can set the minimum TLS version to be 1.2 with the `tls-version-min 1.2` directive. If you do so you loose OpenVPN 2.2 and lower compatibility. If you experience problems you might need to specify the option on both the server and the client configuration.

# Hardening the data channel

## Cipher

The best ciphers available are `AES-256-CBC` or `CAMELLIA-256-CBC`. The former is the USA standard while the second one is the EU one.

I suggest CBC mode as it's recommended by the OpenVPN manpages. You might have heard that it's not secure, but don't worry, that's far from the truth. CBC is secure _if_ used correctly. Fortunately OpenVPN does implement it correctly (it uses encrypt-then-MAC - [You can read more about it here](http://crypto.stackexchange.com/questions/202/should-we-mac-then-encrypt-or-encrypt-then-mac)).

## Message Authentication

Both server and client should use SHA2 with either `auth SHA-256` or `auth SHA-512`

# Mitigating DoS attacks

By using tls-auth you can try to mitigate Denial of Service attacks to your OpenVPN server.

This option works by generating a secret pre-shared key which must then be distributed to your clients (and server) along with the usual certificate/key files. This key is generated only _once_. When a client (or an attacker) connects to the server, unless it has the ta.key file OpenVPN won't even initiate the TLS handshake and drop the connection sooner. This file must be kept secret (just like any other key file). To generate it use:

`openvpn --genkey --secret ta.key`

On the server configuration file add

`tls-auth ta.key 0`

And on the client's configuration file

`tls-auth ta.key 1`

# Mitigating MITM attacks

The `remote-cert-tls` directive is used to mitigate Man in the Middle attacks. To use it:

On your clients' configuration file add `remote-cert-tls server`

If you want to, you can add `remote-cert-tls client` on your server configuration file, but it isn't really necessary.

This only works if each certificate has x509 Extended Key Usage values set correctly. All client certificates must set `clientauth`, while the server certificate must set `serverAuth` as the value. Easy-RSA3 does this for you.

# TCP vs UDP

OpenVPN works best with UDP. It's stateless (meaning, among other things, it doesn't do handshakes), which makes it more suitable for VPN usage. However, in some cases, you might be behind a firewall which outright blocks UDP.

It's also harder to do port scanning with UDP. Therefore, if you can, use UDP.

In my university UDP is blocked (along with most TCP ports). Therefore I use TCP and port 443\. Unless you are behind a very sophisticated firewall with deep packet inspection this setup works for me.

# Android & iPhone

This configuration works with modern iPhone and Android OS using the oficial OpenVPN apps. In both iOS and Android you must disable the `Force AES` option if you use ciphers with GCM or Camellia, but it only comes enabled by default in iOS.

# [ovpn.io](https://vpn.hugofs.com) configuration

Here are ovpn.io's server and client configuration files:

Server

```
# Server parameters
server 10.8.0.0 255.255.255.0
port 443
port-share 127.0.0.1 4443
proto tcp
dev tun
user nobody
group nobody
persist-key
persist-tun
ifconfig-pool-persist ipp.txt
push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 208.67.222.222"
keepalive 10 120

# Control channel (TLS)
tls-version-min 1.2
tls-cipher TLS-DHE-RSA-WITH-AES-256-GCM-SHA384
tls-auth ta.key 0

# Data channel
auth SHA512
cipher AES-256-CBC

# Compression
comp-lzo

# Logging
verb 0

# Certificates
ca ca.crt
cert server.crt
key server.key
dh dh4096.pem
```

Client

```
# Client parameters
client
dev tun
proto tcp
remote ovpn.io 443
resolv-retry infinite
nobind
persist-key
persist-tun

# Control channel (TLS)
tls-version-min 1.2
tls-cipher TLS-DHE-RSA-WITH-AES-256-GCM-SHA384
tls-auth ta.key 1
remote-cert-tls server

# Data channel
auth SHA512
cipher AES-256-CBC

# Compression
comp-lzo yes

# Logging
verb 4

# Certificates
ca ca.crt
cert UUID.crt
key UUID.key
```
