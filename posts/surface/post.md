![Arch Linux running on a first generation Microsoft Surface](/assets/blog/DSC_6733-2.jpg)

## Motivation

There are lots of resources explaining how to do all this stuff, but they are all over the place. You have to Google, search Reddit, read some blog posts, the rEFInd manual, etc. This guide serves as a hub of sorts to find everything you need.

After completing all steps you will have a secure, dual boot environment for the Surface Pro (or any other computer). Most of this guide will also be useful for the Surface Pro 3 and most UEFI-based computers. However some steps are only applicable to the Surface Pro 1/2, and some other steps might be missing for other machines.

If you think something is missing or should be changed please [email me](mailto:me@hugofs.com)!

## What doesn't work

* I haven't found a way to enable the **TPM for Windows** while dual booting. Instead, we will use a password (or usb device) for Bitlocker.
* You will need a **keyboard to change the OS** (rEFInd doesn't have touch support). If you decide to use a password for Bitlocker you will also need a keyboard to boot into Windows.
* **Wi-Fi** only works on older versions of the Linux kernel or with a patched Linux 4.1+. Below I will show you how to compile Linux 4.1.2 with the patches. I will try to setup a repo with an already compiled kernel in the future.

# The _Actual_ Guide

## Very First Steps

Press Vol+ during startup. Disable both Secure Boot and the TPM. Don't worry, we will eventually enable Secure Boot and encrypt both file systems.

## Windows

* Install Windows as usual (unless it's already there)
* Disable/Don't enable BitLocker
* Repartition you hard drive to have enough space for you Linux partition
* Mount a .iso image of your favorite Linux distribution (I'm using [Antergos](http://antergos.com/)) to a USB flash drive (with a tool such as [Rufus](http://rufus.akeo.ie/))

## Linux

* Start your USB partition holding Vol- during startup
* Install Linux as usual. How to install a Linux distribution is out of the scope of this guide but here are a few things you need to take into account:
* Do not use LVM. rEFInd doesn't work with it
* It might be wise to stick with ext4 partitions unless you feel adventurous
* Make sure you leave your Windows' partitions intact. That includes the regular Windows partition, a 300mb Recovery partition and the FAT32 EFI partition (ESP)
* If you need to install `GRUB2` or any other boot loader just install it in the same partition as Linux. We will end up uninstalling any boot loaders in favor of using rEFInd and the kernel's own boot loader
* Boot into your Linux partition
* Install `efibootmgr`
* Remove `GRUB2` or any other boot loader
* Install `rEFInd`
* Hopefully rEFInd will just work and you will have a fully functioning, dual boot system (sans SecureBoot, BitLocker & Wi-Fi)
* If rEFInd isn't working when you start use efibootmgr to see what is going on. Below you can see some commands and explanations to guide you. If Windows boots up directly you can either modify the boot loaders with [bcdedit](https://technet.microsoft.com/en-us/library/cc709667.aspx) or boot up a live Linux distro and use efibootmgr (I find the latter to be more reliable).

## SecureBoot

### Why bother?

1.  It prevents malicious code executing during startup
2.  If you don't, when you power on the Surface Pro, the screen will be bright red

### Explanation

By default, the SP1/2's implementation of Secure Boot only allows Windows' own boot loader. Even third-party Microsoft signed boot loaders will not work.

However Microsoft released a tool to install more sane Secure Boot keys which allow third-party Microsoft signed boot loaders.

We will use PreLoader and HashTool (which **were** signed by Microsoft) to boot into rEFInd, and boot into Windows and Linux.

### Steps

* Boot into Linux
* Download [PreLoader and HashTool](http://blog.hansenpartnership.com/linux-foundation-secure-boot-system-released/). Place them in /boot/EFI/refind
* Delete the "tools_x86", "drivers_x86" and "refind_x86.efi" folders. We will use 64bit .efi files only
* Rename (or create a copy of) "refind_x64.efi" to "loader.efi"
* Delete (and make a backup) of the drivers_x64 folder. If you don't, rEFInd will try to load them but their signature is not valid. For some reason you can't enroll them using HashTool. If you find a way to enroll them please let me know.
* Use efibootmgr to create a new boot entry which points at PreLoader.efi and make sure it's the first entry. At the end you will find the commands to do it
* Ensure that the default Windows boot loader is still present but isn't the first one
* Enter the UEFI (press Vol+ during startup) and enable Secure Boot. Install the default keys
* Boot into Windows and download the [Microsoft UEFI CA](http://www.microsoft.com/en-ph/download/details.aspx?id=41666)
* Follow the steps in the included PDF file. You will need to reboot once during the setup. During that reboot PreLoader will fail to start. That's completely normal. It will boot into Windows. Finish following the instructions and PreLoader should now work.
* Once you reboot again you should end up inside HashTool. Select loader.efi and enroll it. Go up a couple of folders (select "..") and do the same for vmlinuz.
* If you update rEFInd or the Linux kernel you will need to re-enroll the boot loaders, but it shouldn't be too much of a hassle.

## BitLocker on Windows

* Full disclosure - I would like to use the TPM to unlock the device, but even though the chain of trust isn't broken, Windows can't unlock the BitLocker partition using the TPM when it uses rEFInd
* Instead we will use a password (you can also use a USB drive if you prefer. I don't usually carry one around with me so a password seems more convenient)
* Boot into Windows and use gpedit.msc to enable PINs [follow these instructions](https://serverfault.com/questions/55394/how-do-i-set-the-bitlocker-pin)
* Enable BitLocker and select your password. Before encrypting, check the tick box at the end to ensure everything will work as intended
* Windows might throw an error when you try to enable BitLocker, such as "The file was not found". [There is an easy solution that won't mess up your partitions](https://social.technet.microsoft.com/Forums/windows/en-US/51947c62-dbcb-4613-b10d-707ff8b61d0d/bitlocker-the-system-cannot-find-the-file-specified?forum=w8itprosecurity)

## Linux Encryption

TODO

## Fixing the Wi-Fi driver

As I mentioned earlier, Reyad Attiyat made 4 patches to fix the Wi-Fi chipset. These haven't been merged into the mainline kernel yet, so in the meantime we will have to recompile Linux >= 4.1

You might need to follow a guide such as [this one](https://wiki.archlinux.org/index.php/Kernels/Compilation/Traditional), but I will give you a general view of the steps you need to take. It might seem daunting at first, but it's actually pretty straightforward

* [Download the 4 (5 for SP2) patches](https://bugzilla.kernel.org/show_bug.cgi?id=69661#c90) from the kernel's bugtracker. For each one of Reyad's attachments save the "Raw Unified" files with any name and .patch extension
* Then download the latest mainline kernel (at least Linux 4.1) from either git or directly from [kernel.org](https://kernel.org/)
* Extract the kernel, move the patches inside and execute `patch` on all the patch files
* Copy your current kernel configuration with `zcat /proc/config.gz > .config`
* Compile executing `make`. This takes my Surface Pro 1 around 30 minutes. It might ask you some questions about missing configurations. I'm no kernel expert so I would recommend selecting the default options in all cases
* Execute `make modules_install`. This copies the modules (including the patched Wi-Fi drivers) into the appropriate folder
* Copy the kernel into the /boot directory with `cp -v arch/x86/boot/bzImage /boot/vmlinuz-YourKernelName`
* As YourKernelName I usually use something among the lines of Linux-4.1.2
* Make the initial RAM disk with `mkinitcpio -k FullKernelName -c /etc/mkinitcpio.conf -g /boot/initramfs-YourKernelName.img`
* It's vital you enter the same YourKernelName name as before. It won't work if you don't
* The FullKernelName corresponds to the folder the `make install_modules` command made inside /lib/modules/. It should be something similar to ARCH-4.1.2

# efibootmgr Basics

efibootmgr is a simple command line program to change the EFI boot loaders. You usually have to run this as root so any commands must be preceded by sudo. To set everything up these commands will suffice:

* `efibootmgr`
* Displays the boot loaders, and their order
* `efibootmgr -v`
* Same as above but in verbose mode. With this you can see which .efi file corresponds with which bootloader
* `efibootmgr -b Number -B`
* removes the boot loader you specify
* `efibootmgr -o Number,Number,Number`
* Changes the boot order
* `efibootmgr -c -p Number -l \\EFI\\refind\\BootLoader.efi -L BootLoaderName`
* -c creates a new entry
* -p is to select the partition number. -p 2 means the EFI partition is dev/sda2
* -l is the location of the .efi file
* -L is the name of the bootloader)
* remember to use \\\\

# Useful Links

[David Elner's blog post](http://blog.davidelner.com/dual-booting-ubuntu-14-10-on-the-surface-pro-3/)

[The rEFInd manual](http://www.rodsbooks.com/refind/)

[SurfaceLinux Subreddit](https://www.reddit.com/r/surfacelinux)

[efibootmgr's manpage](http://linux.die.net/man/8/efibootmgr)

[BCDEdit Command-Line Options](https://technet.microsoft.com/en-us/library/cc709667.aspx)
