function get(rinfo_address) {
  if (rinfo_address == '::ffff:127.0.0.1') {
    return 'IPv4';
  } else {
    return 'IPv6';
  }
}

exports.get = get;